import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { getHtmlContent, getLabelHtmlContent } from "../services/print";
import { NetPrinter } from "react-native-thermal-receipt-printer-image-qr";
import { getOrderDetails } from "../services/order-api";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Notifications from "expo-notifications";
import { View, Text } from "react-native";
import RNFS from "react-native-fs";
import { PermissionsAndroid } from "react-native";

async function requestStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "Storage Permission",
        message: "App needs access to your storage to print the image",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface OrderContextProps {
  orders: any[];
  loading: boolean;
  error: Error | null;
  totalRevenue: number;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

interface OrderProviderProps {
  children: React.ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [printText, setPrintText] = useState<string | null>(null); // Lưu nội dung in

  const viewShotRef = useRef(null);

  const waitForFile = async (filePath, maxRetries = 10, delay = 500) => {
    for (let i = 0; i < maxRetries; i++) {
      const exists = await RNFS.exists(filePath);
      if (exists) return true;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return false;
  };

  const printBitmapOrder = async (text, printerIp) => {
    try {
      setPrintText(text);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Chờ UI cập nhật

      const tempUri = await viewShotRef.current.capture();
      console.log("Captured Image thành công:", tempUri);

      const customUri = `${RNFS.DocumentDirectoryPath}/print_image.png`; // Đường dẫn tùy chỉnh

      // Di chuyển file từ cache sang thư mục mong muốn
      await RNFS.moveFile(tempUri.replace("file://", ""), customUri);
      console.log("✅ File đã được lưu tại:", customUri);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const base64Image = await RNFS.readFile(customUri, "base64");

      console.log("Init NetPrinter...", printerIp);
      await NetPrinter.init();
      await NetPrinter.connectPrinter(printerIp, 9100);

      await NetPrinter.printImageBase64(base64Image, { imageWidth: 576 });

      console.log(`✅ Đã in xong: ${text}`);

      // Xóa file sau khi in xong nếu cần
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await RNFS.unlink(customUri);
    } catch (error) {
      //console.error("❌ Error printing bitmap:", error);
    }
  };
  const printOrder = async (order, printType: string, selectedPrinter: any) => {
    console.log("Dạng in, máy in cho dạng in:", printType);

    try {
      const orderDetails = await getOrderDetails(
        order.ID,
        user?.grabFoodToken || ""
      );
      const detailedOrder = orderDetails.orderData;

      let htmlContent;
      switch (printType) {
        case "customer":
          htmlContent = getHtmlContent(detailedOrder, "customer", "grabfood");
          break;
        case "restaurant":
          htmlContent = getHtmlContent(detailedOrder, "restaurant", "grabfood");
          break;
        case "kitchen":
          htmlContent = getHtmlContent(detailedOrder, "kitchen", "grabfood");
          break;
        case "label":
          htmlContent = getLabelHtmlContent(detailedOrder);
          break;
        default:
          throw new Error("Invalid print type");
      }

      await printBitmapOrder(htmlContent, selectedPrinter);
    } catch (error) {
      console.error("Error printing order details:", error);
    }
  };

  const getIPPrinter = (printerType: string) => {
    let ip = "";
    user?.printers.forEach((printer) => {
      if (printer.type === printerType) {
        ip = printer.ip;
        return;
      }
    });
    return ip;
  };

  const printOrderWithRetry = async (order, type, ip, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`🔄 Đang in: ${type} (Thử lần ${i + 1})`);
        await printOrder(order, type, ip);
        console.log(`✅ In thành công: ${type}`);
        return;
      } catch (error) {
        console.error(`❌ Lỗi in ${type}:`, error);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Chờ trước khi thử lại
      }
    }
    console.error(`🚨 In thất bại sau ${retries} lần: ${type}`);
  };

  const processPrintQueue = async (order) => {
    await printOrderWithRetry(order, "customer", getIPPrinter("customer"));
    await printOrderWithRetry(order, "kitchen", getIPPrinter("kitchen"));
    await printOrderWithRetry(order, "restaurant", getIPPrinter("restaurant"));
    await printOrderWithRetry(order, "label", getIPPrinter("label"));
  };

  useEffect(() => {
    //requestStoragePermission();
    // Gọi hàm với IP máy in và URL ảnh

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const endTime = new Date().toISOString();
        const startTime = new Date(
          new Date().setDate(new Date().getDate() - 29)
        ).toISOString();
        const pageIndex = 0;
        const pageSize = 100;
        const grabFoodToken = user?.grabFoodToken;

        // Fetch order history from the backend
        const response = await axios.get(
          "https://foodlink-api.onrender.com/order-history",
          {
            params: {
              startTime,
              endTime,
              pageIndex,
              pageSize,
              grabFoodToken,
              username: user?.username,
            },
          }
        );

        const ordersData = response.data.orders;

        console.log(
          "Orders fetched new:",
          response.data.newOrders,
          response.data.updatedOrders
        );

        // Cập nhật danh sách đơn hàng và tổng doanh thu
        setOrders(ordersData);
        const totalRev = ordersData.reduce(
          (acc: number, order: { priceDisplay: string }) => {
            const price = parseFloat(order.priceDisplay);
            return acc + (isNaN(price) ? 0 : price);
          },
          0
        );
        setTotalRevenue(totalRev * 1000);

        for (const order of ordersData) {
          //console.log("Order to Noti:", order.displayID);
          //console.log("New order:", order.isNew);
          if (order.isNew) {
            console.log("New order:", order.displayID);
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Đơn hàng mới",
                body: `Bạn có đơn hàng mới - ${order.displayID}`,
              },
              trigger: null,
            });

            order.isNew = false;

            processPrintQueue(order);
          }
        }
      } catch (error) {
        setError(error as Error);
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.grabFoodToken) {
      console.log("Fetch Order...");
      fetchOrders();
      const intervalId = setInterval(fetchOrders, 20000); // Fetch every 25 seconds
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [user]);

  return (
    <OrderContext.Provider value={{ orders, loading, error, totalRevenue }}>
      {children}
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1.0 }}
        style={{
          position: "absolute", // Ẩn khỏi UI
          top: -1000,
          left: -1000,
          width: 576, // Đảm bảo chiều rộng đúng của máy in 80mm
          padding: 5,
          backgroundColor: "white",
        }}
      >
        <View style={{ padding: 5, width: "100%" }}>
          <Text
            style={{
              fontSize: 16,
              textAlign: "left",
              flexWrap: "wrap", // Cho phép text xuống dòng tự nhiên
              width: "100%", // Đảm bảo text không bị bóp
              lineHeight: 24, // Tăng khoảng cách giữa các dòng để dễ đọc
            }}
          >
            {printText}
          </Text>
        </View>
      </ViewShot>
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
