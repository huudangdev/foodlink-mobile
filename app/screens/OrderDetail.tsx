import { useRoute } from "@react-navigation/native";
import { Divider, Icon } from "@rneui/base";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { getOrderDetails } from "../services/order-api";
import { useAuth } from "../context/AuthContext";
import { getHtmlContent, getLabelHtmlContent } from "../services/print";
import { NetPrinter } from "react-native-thermal-receipt-printer-image-qr";
import Modal from "react-native-modal";
import RNPickerSelect from "react-native-picker-select";
import RNFS from "react-native-fs";
import ViewShot, { captureRef } from "react-native-view-shot";

type RouteParams = {
  info: string;
};

type Order = {
  orderID: string;
  driver: any;
  eater: {
    name: string;
    mobileNumber: string;
    comment: string;
    address: {
      address: string;
      keywords: string;
    };
  };
  itemInfo: {
    count: number;
    items: {
      image: any;
      name: string;
      quantity: number;
      fare: {
        currencySymbol: string;
        priceDisplay: string;
        originalItemPriceDisplay: string;
        beforeAdjustedPriceDisplay: string;
      };
      comment: string;
      modifierGroups: {
        modifierGroupID: string;
        modifierGroupName: string;
        modifiers: {
          modifierID: string;
          modifierName: string;
          priceDisplay: string;
          quantity: number;
          revampedPriceDisplay: string;
          editedStatus: number;
        }[];
      }[];
      discountInfo: any;
      itemID: string;
      editedStatus: number;
      weight: any;
      itemCode: string;
      specialItemType: string;
      soldByWeight: boolean;
      outOfStockInstruction: any;
      parentID: string;
      parentName: string;
      skuID: string;
      isAddedAsReplacement: boolean;
    }[];
    merchantItems: any;
  };
  fare: {
    currencySymbol: string;
    totalInCent: number;
    adjustmentByDriverInCent: number;
    totalDisplay: string;
    subTotalDisplay: string;
    taxDisplay: string;
    adjustmentByDriverDisplay: string;
    promotionDisplay: string;
    deliveryFeeDisplay: string;
    passengerTotalDisplay: string;
    totalDiscountAmountDisplay: string;
    reducedPriceDisplay: string;
    revampedSubtotalDisplay: string;
    cancelledDisplay: string;
    taxRate: string;
    merchantChargeDisplay: string;
    isIncludeMerchantChargeTax: boolean;
    subtotalIncludeMerchantCharge: string;
    chargeFeeDescription: {
      en: string;
      id: string;
      ms: string;
      th: string;
      vi: string;
      zh: string;
    };
    smallOrderFeeDisplay: string;
    serviceChargeFeeDisplay: string;
    serviceChargeFeeDescription: {
      en: string;
      id: string;
      km: string;
      ms: string;
      my: string;
      th: string;
      vi: string;
      zh: string;
    };
    daxPayMexFareDisplay: string;
    mexCommissionDisplay: string;
  };
  times: {
    createdAt: string;
    deliveredAt: string;
    completedAt: string;
    expiredAt: string;
    acceptedAt: string;
    cancelledAt: string;
    readyAt: any;
    displayedAt: string;
    driverArriveRestoAt: any;
    preparationCompletedAt: any;
  };
  state: string;
  merchant: {
    ID: string;
  };
  deliveryTaskpoolStatus: string;
  preparationTaskpoolStatus: string;
  cancelCode: number;
  displayID: string;
  bookingCode: string;
  paymentMethod: string;
  acceptedViaCall: boolean;
  acceptedViaAA: boolean;
  acknowledgedForAA: boolean;
  qsrModelType: number;
  hasPromo: boolean;
  receiptAdditionalInfo: {
    supportFeatureFlags: {
      showCashToCollect: boolean;
    };
    printedCount: number;
  };
  allowComplete: boolean;
  isTakeawayOrder: boolean;
  orderLevelDiscounts: any;
  flags: {
    showReceiptEaterAddress: boolean;
    showForceCompleteButton: boolean;
    hideOrderDriverInfo: boolean;
    isPrintOrderRevampReceipt: boolean;
    isGrabInitiatedSplitOrder: boolean;
    isAdsMarketingAttributed: boolean;
    isPaxNewCustomer: boolean;
    isPayOnCollect: boolean;
    merchantFeatureFlags: number;
  };
  scheduledOrderInfo: any;
  isLargeOrder: boolean;
  isEditable: boolean;
  isOrderEdited: boolean;
  isOrderWithFriends: boolean;
  uneditableReason: number;
  cutlery: number;
  cancelBy: string;
  cancelRole: string;
  leadsGenData: {
    isDeliverByMex: boolean;
    isOrderValueLow: boolean;
    deliveryFee: string;
    timeLeftToEnableCompleteButton: number;
    geAllocationStatus: number;
    grabExpressDriver: any;
    paxDistanceToMex: number;
  };
  isBusyModeOrder: boolean;
  busyModeOrderPickupTime: string;
  busyModeApproach: number;
  payMerchant: boolean;
  cancelledMsg: string;
  orderFlags: number;
  orderStatsFlags: number;
  receiptFlags: number;
  dineInInfo: any;
  chatroomInfo: {
    roomID: string;
    status: number;
  };
  membershipID: string;
  mcorInfo: {
    supportMcor: boolean;
    isEditable: boolean;
    correctedOrderReadyAt: any;
    estimatedOrderReadyAt: string;
    driverCloseToPickingUp: boolean;
    maxOrderReadyAt: string;
  };
  mexReimbursementInfo: any;
  displayHighlights: {
    highlightItemCount: boolean;
    missingItemIDs: any;
  };
  giftInfo: any;
  orderBookings: any;
  incidents: {
    hasError: boolean;
    data: any[];
  };
  voucherInfo: any;
  stampInfo: {
    userConsentMsg: string;
  };
  mexOPT: {
    submittedOPTFromMex: number;
    sourceOPT: number;
    isPreparationTaskDelayed: boolean;
    isReadyButtonAbused: boolean;
    actualOPT: any;
  };
  replacementInfo: any;
  isEditableByPax: boolean;
  preparationTaskID: string;
};

interface INetPrinter {
  device_name: string;
  host: string;
  port: number;
}

const OrderDetailsScreen = () => {
  const route = useRoute();
  const { info } = route.params as RouteParams;
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState("Chờ xác nhận");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [printOption, setPrintOption] = useState("customer");
  const [showOption, setShowOption] = useState(false);
  const [items, setItems] = useState([
    { label: "In bill cho khách", value: "customer" },
    { label: "In bill cho bếp", value: "kitchen" },
    { label: "In nhãn cho món", value: "label" },
  ]);
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState<string | null>(null);
  const [printers, setPrinters] = useState<INetPrinter[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [printText, setPrintText] = useState("");

  const viewShotRef = useRef(null);

  const data = JSON.parse(info);

  //console.log("Order data:", order);

  useEffect(() => {
    const orderID = JSON.parse(info).ID;

    console.log("ID: ", orderID);
    const fetchOrderDetails = async () => {
      try {
        const orderData = await getOrderDetails(
          orderID,
          user?.grabFoodToken || ""
          //user?.storeInfo?.data?
        );
        //console.log("Order data:", orderData);
        setOrder(orderData.orderData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    console.log("Order detail:", order);

    fetchOrderDetails();
  }, [info]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "#4CAF50"; // Green
      case "PREPARING":
        return "#2196F3"; // Blue
      case "CANCELLED":
        return "#F44336"; // Red
      default:
        return "#FFA000"; // Orange
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Đơn hoàn thành";
      case "PREPARING":
        return "Đang xử lý";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Đơn mới";
    }
  };

  const printBitmapOrder = async (text, printerIp) => {
    try {
      setPrintText(text); // Cập nhật nội dung cần in
      await new Promise((resolve) => setTimeout(resolve, 500)); // Chờ update UI

      const uri = await viewShotRef.current.capture();

      console.log("Captured Image thành công:", uri, printerIp);

      // Chờ 1 giây trước khi đọc file (tránh lỗi "image not found")
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Đọc file ảnh và chuyển sang Base64
      const formattedUri = uri.replace("file://", "");

      //   const exists = await RNFS.exists(formattedUri);
      //   if (!exists) {
      //     console.error("Error: Image file not found!");
      //     return;
      //   }

      const base64Image = await RNFS.readFile(formattedUri, "base64");
      //console.log("Base64 Image:", base64Image);
      //const finalImage = `data:image/png;base64,${base64Image}`;

      await NetPrinter.init();
      await NetPrinter.connectPrinter(printerIp, 9100);

      // In ảnh dưới dạng Base64 thay vì URI
      await NetPrinter.printImageBase64(base64Image, {
        imageWidth: 384, // thay đổi để phù hợp khổ in 58
        // imageHeight: 1000,
        // paddingX: 100
      });
    } catch (error) {
      console.error("Error printing bitmap:", error);
    }
  };

  const printOrder = async (order, printType: string, selectedPrinter: any) => {
    console.log("Dạng in, máy in cho dạng in:", printType, selectedPrinter);

    try {
      let htmlContent;
      switch (printType) {
        case "customer":
          htmlContent = getHtmlContent(order, "customer", "grabfood");
          break;
        case "restaurant":
          htmlContent = getHtmlContent(order, "restaurant", "grabfood");
          break;
        case "kitchen":
          htmlContent = getHtmlContent(order, "kitchen", "grabfood");
          break;
        case "label":
          htmlContent = getLabelHtmlContent(order);
          break;
        default:
          throw new Error("Invalid print type");
      }

      await printBitmapOrder(htmlContent, selectedPrinter);
    } catch (error) {
      console.error("Error printing order details:", error);
    }
  };
  const handlePrint = async () => {
    if (printOption && selectedPrinter) {
      await printOrder(order, printOption, selectedPrinter);
      setIsModalVisible(false);
    } else {
      Alert.alert("Lỗi", "Hãy chọn loại in và máy in");
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

  const handlePrintDefaults = async () => {
    await printOrder(order, "customer", getIPPrinter("customer"));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderOrderItem = ({
    item,
  }: {
    item: {
      id: string;
      name: string;
      quantity: number;
      fare: {
        priceDisplay: string;
      };
      image: any;
    };
  }) => {
    return (
      <View style={styles.itemContainer} key={item.name}>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQuantity}>x{item.quantity}</Text>
        </View>
        <Text style={styles.itemPrice}>{item.fare?.priceDisplay}</Text>
      </View>
    );
  };

  const handleConfirm = () => {
    setOrderStatus("Đã xác nhận");
    setIsConfirmed(true);
  };
  const handleCancel = () => {
    setOrderStatus("Đã huỷ");
    setIsConfirmed(true);
  };

  const handleOutOfStock = () => {
    setOrderStatus("Hết món");
    setIsConfirmed(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.customerInfo}>
        <View style={styles.infoCustomer}>
          <Image
            source={require("@/assets/logo/grabfood.png")}
            style={styles.platformLogo}
          />
          <Text style={styles.customerName}>
            {data.displayID === "GF-985"
              ? "Abbas"
              : data && data.eater && data.eater.name
              ? `${String(data.eater.name)}`
              : "Khách hàng: ***"}
          </Text>

          <TouchableOpacity
            onPress={() => {
              const phoneNumber = data.eater?.mobileNumber || "N/A";
              if (phoneNumber !== "N/A") {
                Linking.openURL(`tel:${phoneNumber}`);
              } else {
                Alert.alert("Lỗi", "Không có số điện thoại để gọi");
              }
            }}
            style={styles.callButton}
          >
            <Icon name="call" size={16} color="#555" />
            <Text> Call </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusButton,
              {
                backgroundColor: getStatusColor(
                  data.deliveryStatus.split("_")[0]
                ),
              },
            ]}
          >
            <Text style={[styles.statusText, { color: "white" }]}>
              {getStatusText(data.deliveryStatus.split("_")[0])}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoCustomer}>
          <Text style={styles.deliveryTime}>Order ID: {data.displayID}</Text>
          <Text style={styles.deliveryTime}>
            Được tạo lúc: {new Date(data.createdAt).toLocaleTimeString()}
          </Text>
        </View>
        <View style={styles.timesContainer}>
          <Text style={styles.timesTitle}>Thời gian chi tiết</Text>
          <Text style={styles.timeLabel}>
            Xác nhận vào lúc:{" "}
            {order &&
              order.times &&
              new Date(order.times.acceptedAt).toLocaleString()}
          </Text>
          <Text style={styles.timeLabel}>
            Huỷ lúc:{" "}
            {order ? new Date(order.times.cancelledAt).toLocaleString() : "N/A"}
          </Text>
          <Text style={styles.timeLabel}>
            Hoàn thành lúc:{" "}
            {order ? new Date(order.times.completedAt).toLocaleString() : "N/A"}
          </Text>
        </View>
        {order?.state === "COMPLETED" && (
          <View style={styles.timesContainer}>
            <Text style={styles.timesTitle}>Thông tin giao hàng</Text>
            <Text style={styles.timeLabel}>
              Địa chỉ: {order?.eater?.address?.address || "N/A"}
            </Text>
            <Text style={styles.timeLabel}>
              Tài xế: {order?.driver?.name || "N/A"}
            </Text>
            <Text style={styles.timeLabel}>
              Phương thức thanh toán: {order?.paymentMethod || "N/A"}
            </Text>
          </View>
        )}
        <View style={styles.CTA}>
          {/* Call Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePrintDefaults()}
          >
            <Icon
              name="print"
              size={24}
              color="#555"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>In hoá đơn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(true);
            }}
          >
            <Icon
              name="more-vert"
              type="material"
              size={24}
              color="#555"
              style={{ margin: 16 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <RNPickerSelect
            onValueChange={(value) => setPrintOption(value)}
            items={[
              { label: "In bill cho khách", value: "customer" },
              { label: "In bill cho quán", value: "kitchen" },
              { label: "In nhãn", value: "label" },
            ]}
            placeholder={{ label: "Chọn loại In", value: null }}
            style={pickerSelectStyles}
          />
          <RNPickerSelect
            onValueChange={(value) => setSelectedPrinter(value)}
            items={user?.printers?.map((printer: any) => ({
              label: printer.name,
              value: printer.ip,
            }))}
            placeholder={{ label: "Chọn máy In", value: null }}
            style={pickerSelectStyles}
          />
          <TouchableOpacity
            style={styles.printButtonCustom}
            onPress={() => handlePrint()}
          >
            <Text style={styles.printButtonText}>In</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        data={(order?.itemInfo.items || []).map((item, index) => ({
          ...item,
          id: item.itemID || index.toString(),
          image: item?.image || require("../../assets/images/example-item.png"),
        }))}
        keyExtractor={(item, index) => index.toLocaleString()}
        renderItem={renderOrderItem}
      />

      <Divider />

      <View style={styles.totalContainer}>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Phí vận chuyển:</Text>
          <Text style={styles.totalValue}>
            {" "}
            {order?.fare?.deliveryFeeDisplay || "N/A"} VND
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Thuế:</Text>
          <Text style={styles.totalValue}>
            {" "}
            {order?.fare?.taxDisplay || "N/A"} VND
          </Text>
        </View>
      </View>
      <View style={styles.totalContainer}>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Khuyến mãi:</Text>
          <Text style={styles.totalValue}>
            {" "}
            {order?.fare?.promotionDisplay || "N/A"} VND
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Phí dịch vụ:</Text>
          <Text style={styles.totalValue}>
            {" "}
            {order?.fare?.serviceChargeFeeDisplay || "N/A"} VND
          </Text>
        </View>
      </View>
      <View style={styles.totalContainer}>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Phí đơn hàng nhỏ:</Text>
          <Text style={styles.totalValue}>
            {" "}
            {order?.fare?.smallOrderFeeDisplay || "N/A"} VND
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Voucher:</Text>
          <Text style={styles.totalValue}>
            {" "}
            {order?.orderLevelDiscounts?.[0]?.discountAmountDisplay ||
              "N/A"}{" "}
            VND
          </Text>
        </View>
      </View>

      <Divider />

      <View style={styles.totalContainer}>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Số món:</Text>
          <Text style={styles.totalValue}>
            {" "}
            {order && order.itemInfo && typeof order.itemInfo.count === "number"
              ? order.itemInfo.count
              : 0}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalAmount}>
            {" "}
            {(order && order.fare ? order.fare.totalDisplay : 0) || 0} VND
          </Text>
        </View>
      </View>

      {data.deliveryStatus.split("_")[0] !== "COMPLETED" &&
        data.deliveryStatus.split("_")[0] !== "CANCELLED" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outOfStockButton}
              onPress={handleOutOfStock}
            >
              <Text style={styles.buttonText}>Hết món</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Huỷ Đơn</Text>
            </TouchableOpacity>
          </View>
        )}
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
              fontSize: 18,
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
    </SafeAreaView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // để đảm bảo text không bị che bởi icon
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // để đảm bảo text không bị che bởi icon
    marginBottom: 16,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 8, margin: 8 },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    alignItems: "center",
    height: "40%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  callButton: {
    flexDirection: "row",
    marginLeft: 8, // Khoảng cách giữa tên khách hàng và nút gọi
    padding: 8, // Thêm padding cho nút
    borderRadius: 5, // Bo tròn góc
    backgroundColor: "#f0f0f0", // Màu nền cho nút
    alignItems: "center", // Căn giữa icon
    justifyContent: "center", // Căn giữa icon
  },
  printButtonCustom: {
    backgroundColor: "#FFA000", // Màu cam chủ đạo
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    position: "absolute",
    bottom: 20,
    width: "90%", // Chiều ngang của nút là 90% của modal
    alignItems: "center",
  },
  printButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 12,
    color: "#333",
  },
  customerInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  infoCustomer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  CTA: {
    flexDirection: "row",
    //justifyContent: "space-between",
    //alignItems: "center",
  },
  platformLogo: {
    width: 32,
    height: 32,
    marginRight: 0,
  },
  customerName: { fontSize: 16, fontWeight: "bold", marginLeft: -8 },
  status: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  statusButton: {
    //backgroundColor: "#FFF3E0",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  statusText: {
    color: "#FFA000",
    fontWeight: "bold",
  },
  confirmedStatus: {
    backgroundColor: "green",
  },
  cancelledStatus: {
    backgroundColor: "red",
  },
  outOfStockStatus: {
    backgroundColor: "purple",
  },
  defaultStatus: {
    backgroundColor: "orange",
  },
  deliveryTime: { fontSize: 14, color: "#555" },
  button: {
    backgroundColor: "#D9D9D9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
    width: "85%",
  },
  buttonText: {
    fontSize: 10,
    color: "#858585",
    fontWeight: "400",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 0,
    marginHorizontal: 16,
    paddingTop: 16,
  },
  itemImage: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 12, fontWeight: "600" },
  itemQuantity: { color: "#999" },
  itemPrice: { fontSize: 12, fontWeight: "600", color: "#000" },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 8,
    //borderTopWidth: 1,
    paddingTop: 0,
    borderColor: "#ccc",
    alignItems: "flex-end",
  },
  totalLabel: { fontSize: 12, color: "#555" },
  totalAmount: { fontSize: 15, fontWeight: "bold", color: "#000" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
    paddingVertical: 4,
    paddingHorizontal: 16,
    height: 65,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#C0EEBF",
    padding: 10,
    margin: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  outOfStockButton: {
    flex: 1,
    backgroundColor: "#C2BDF0",
    padding: 10,
    margin: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#EAB6B6",
    padding: 10,
    margin: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  timesContainer: {
    marginTop: 8,
  },
  timesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
});

export default OrderDetailsScreen;
