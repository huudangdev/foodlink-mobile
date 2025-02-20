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
  shopeeOrders: any[];
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

interface OrderProviderProps {
  children: React.ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [shopeeOrders, setShopeeOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [printText, setPrintText] = useState<string | null>(null); // Lưu nội dung in
  const [notifiedOrders, setNotifiedOrders] = useState<Set<string>>(new Set()); // Thêm state để theo dõi các đơn hàng đã thông báo

  const viewShotRef = useRef(null);

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

      await NetPrinter.printImageBase64(base64Image, { imageWidth: 384 });

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
        let response = await axios.get("http://52.77.222.212/order-history", {
          params: {
            startTime,
            endTime,
            pageIndex,
            pageSize,
            grabFoodToken,
            username: user?.username,
          },
        });

        const ordersData = response.data.orders;
        const newOrders = response.data.newOrders;
        const updatedOrders = response.data.updatedOrders;

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

        //response = await axios.get(
        //  "http://52.77.222.212/shopeefood/orders"
        //);
        //const shopeeOrderData = response.data.orders;
        //setShopeeOrders(shopeeOrderData);

        for (const order of newOrders) {
          if (!notifiedOrders.has(order.displayID)) {
            console.log("New order:", order.displayID);
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Đơn hàng mới",
                body: `Bạn có đơn hàng mới - ${order.displayID}`,
              },
              trigger: null,
            });

            // Thêm đơn hàng vào danh sách đã thông báo
            setNotifiedOrders((prev) => new Set(prev).add(order.displayID));

            order.isNew = false;

            // Lưu thông báo vào DB
            try {
              await axios.post("http://52.77.222.212/api/save-notification", {
                username: user?.username,
                title: "Đơn hàng mới",
                message: `Bạn có đơn hàng mới - ${order.displayID}`,
                ID: order.ID,
              });
              console.log("Notification saved to database");
            } catch (error) {
              console.error("Error saving notification:", error);
            }

            processPrintQueue(order);
          }
        }
        for (const order of updatedOrders) {
          console.log("Updated order:", order.displayID);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Đơn hàng cập nhật",
              body: `Bạn có đơn hàng ${order.displayID} vừa được cập nhật`,
            },
            trigger: null,
          });

          // Lưu thông báo vào DB
          try {
            await axios.post("http://52.77.222.212/api/save-notification", {
              username: user?.username,
              title: "Đơn hàng cập nhật",
              message: `Bạn có đơn hàng ${order.displayID} vừa được cập nhật`,
              ID: order.ID,
            });
            console.log("Notification saved to database");
          } catch (error) {
            console.error("Error saving notification:", error);
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
    <OrderContext.Provider
      value={{ orders, loading, error, totalRevenue, shopeeOrders }}
    >
      {children}
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1.0, width: 384 }}
        style={{
          position: "absolute", // Ẩn khỏi UI
          top: -1000,
          left: -1000,
          width: 576, // Đảm bảo chiều rộng đúng của máy in 80mm
          padding: 5,
          backgroundColor: "white",
        }}
      >
        <View style={{ padding: 5, width: 384 }}>
          <Text
            style={{
              fontSize: 12,
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
