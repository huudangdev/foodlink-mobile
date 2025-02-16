import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import { View, Text } from "@/components/Themed";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Icon } from "@rneui/base";
import { router, useNavigation } from "expo-router";
import { getGrabFoodOrders } from "../services/grabfood";
import { useAuth } from "../context/AuthContext";
import { getStoreInfo } from "../services/storeApi";
import useFetchOrders from "../hooks/useFetchOrders";
import { useOrders } from "../context/OrderContext";

interface Order {
  name: Order;
  eater: Order;
  displayID: string;
  createdAt: string | number | Date;
  cancelledOriginalPriceDisplay: any;
  deliveryStatus: any;
  id: string;
  customer: string;
  status: string;
  platform: string;
  deliveryTime: string;
  totalItems: number;
  totalPrice: number;
  items: { name: string; quantity: number; price: number }[];
  orderDetails?: {
    orderValue:
      | {
          itemInfo:
            | {
                count:
                  | {
                      items:
                        | {
                            map(
                              arg0: (item: any, index: any) => React.JSX.Element
                            ): React.ReactNode;
                            eater?: { name: string };
                          }
                        | undefined;
                      eater?: { name: string };
                    }
                  | undefined;
                items:
                  | {
                      map(
                        arg0: (item: any, index: any) => React.JSX.Element
                      ): React.ReactNode;
                      eater?: { name: string };
                    }
                  | undefined;
                eater?: { name: string };
              }
            | undefined;
          eater?: { name: string };
        }
      | undefined;
    itemInfo:
      | {
          count:
            | {
                items:
                  | {
                      map(
                        arg0: (item: any, index: any) => React.JSX.Element
                      ): React.ReactNode;
                      eater?: { name: string };
                    }
                  | undefined;
                eater?: { name: string };
              }
            | undefined;
          items:
            | {
                map(
                  arg0: (item: any, index: any) => React.JSX.Element
                ): React.ReactNode;
                eater?: { name: string };
              }
            | undefined;
          eater?: { name: string };
        }
      | undefined;
    eater?: { name: string };
  };
}

const Home = () => {
  //const [orders, setOrders] = useState<Order[]>([]);
  const { orders, loading, error, totalRevenue } = useOrders();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("ShopeeFood");
  const { user, setUser } = useAuth();

  const { notifications, ...userWithoutNotifications } = user || {};

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const storeInfo = await getStoreInfo(user?.grabFoodToken as string);
        setUser((prev: User) => ({ ...prev, storeInfo }));
      } catch (error) {}
    };
    if (user?.grabFoodToken) fetchStoreInfo();
  }, [user?.grabFoodToken]);

  const handleReportPress = (label: string) => {
    if (label === "Đơn hàng") {
      router.push("/screens/CustomerReportScreen");
    } else if (label === "Doanh thu") {
      router.push("/screens/RevenueReportScreen");
    }
  };

  const handleOrderPress = (order: Order) => {
    router.push({
      pathname: "/screens/OrderDetail",
      params: { info: JSON.stringify(order) },
    });
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    const filtered = orders.filter(
      (order) =>
        (order?.orderDetails?.eater?.name
          ?.toLowerCase()
          .includes(text?.toLowerCase()) ||
          order?.displayID?.toLowerCase().includes(text?.toLowerCase())) &&
        (selectedStatus === "" ||
          order.deliveryStatus?.split("_")[0] === selectedStatus)
    );
    setFilteredOrders(filtered);
  };

  const handleFilter = (status: string) => {
    setSelectedStatus(status);
    const filtered = orders.filter(
      (order) =>
        (order?.orderDetails?.eater?.name
          .toLowerCase()
          .includes(searchTerm?.toLowerCase()) ||
          order?.displayID
            ?.toLowerCase()
            .includes(searchTerm?.toLowerCase())) &&
        (status === "" || order.deliveryStatus?.split("_")[0] === status)
    );
    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "#4CAF50"; // Green
      case "ORDER":
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
      case "ORDER":
        return "Đang xử lý";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Đơn mới";
    }
  };

  const getTags = (order: any): string[] => {
    const tags: string[] = [];
    if (order.isAcceptedByAA) tags.push("Xác nhận tự động");
    if (order.isTakeawayOrder) tags.push("Đơn tự đến lấy");
    if (order.isOrderEdited) tags.push("Đơn đã chỉnh sửa");
    if (order.isPaxNewCustomer) tags.push("Khách hàng mới");
    if (order.isPreparationTaskDelayed) tags.push("Đơn trễ");
    if (order.isScheduledOrder) tags.push("Đơn đặt trước");
    return tags;
  };

  if (!user?.grabFoodToken && !user?.shopeeFoodToken) {
    return (
      <View style={styles.centeredContent}>
        <Text style={styles.loginPrompt}>
          Hãy đăng nhập vào ứng dụng Food App đầu tiên của bạn để xem đơn hàng.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/screens/DrawerScreen")}
        >
          <Text style={styles.loginButtonText}>Kết nối ngay</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return <Text>Error fetching orders: {error.message}</Text>;
  }

  if (loading && (!orders || !orders.length)) {
    return (
      <View style={styles.centeredContent}>
        <ActivityIndicator size="large" color="#FFA000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          {
            label: "Đơn hàng",
            value: orders.length || "0",
            image: require("../../assets/images/order-background.jpg"),
          },
          {
            label: "Doanh thu",
            value: `${totalRevenue.toLocaleString("vi-VN")} VNĐ`,
            image: require("../../assets/images/revenue-background.png"),
          },
        ].map((stat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.statCard}
            onPress={() => handleReportPress(stat.label)}
          >
            <Image source={stat.image} style={styles.statImage} />
            <View style={styles.textContainer}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#6e6e6e" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm theo tên khách hàng hoặc ID..."
          placeholderTextColor="#6e6e6e"
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          margin: 24,
          marginTop: -8,
        }}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              borderRadius: 20,
              backgroundColor: selectedStatus === "" ? "#FFA000" : "#F5F5F5",
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginRight: 8,
            },
          ]}
          onPress={() => handleFilter("")}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: selectedStatus === "" ? "white" : "black" },
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              borderRadius: 20,
              backgroundColor:
                selectedStatus === "PREPARING" ? "#FFA000" : "#F5F5F5",
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginRight: 8,
            },
          ]}
          onPress={() => handleFilter("PREPARING")}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: selectedStatus === "PREPARING" ? "white" : "black" },
            ]}
          >
            Đang xử lý
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              borderRadius: 20,
              backgroundColor:
                selectedStatus === "COMPLETED" ? "#FFA000" : "#F5F5F5",
              paddingHorizontal: 16,
              paddingVertical: 8,
            },
          ]}
          onPress={() => handleFilter("COMPLETED")}
        >
          <Text
            style={[
              styles.filterButtonText,
              {
                color: selectedStatus === "COMPLETED" ? "white" : "black",
              },
            ]}
          >
            Đơn hoàn thành
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              borderRadius: 20,
              backgroundColor:
                selectedStatus === "CANCELLED" ? "#FFA000" : "#F5F5F5",
              paddingHorizontal: 16,
              paddingVertical: 8,
            },
          ]}
          onPress={() => handleFilter("CANCELLED")}
        >
          <Text
            style={[
              styles.filterButtonText,
              {
                color: selectedStatus === "CANCELLED" ? "white" : "black",
              },
            ]}
          >
            Huỷ
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          textAlign: "center",
          color: "gray",
          fontFamily: "thin",
          marginBottom: 8,
        }}
      >
        *Danh sách chỉ hiển thị các đơn hàng trong phạm vi 30 ngày.
      </Text>

      <ScrollView horizontal={false} style={[styles.orderList]}>
        {filteredOrders.map((order, index) => {
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleOrderPress(order)}
              key={index}
            >
              {/* Customer and Order Information */}
              <View style={styles.header}>
                <Image
                  source={
                    order.platform === "ShopeeFood"
                      ? require("@/assets/logo/shoppefood.png")
                      : require("@/assets/logo/grabfood.png")
                  }
                  style={styles.platformLogo}
                />
                <View>
                  <Text style={styles.customer}>
                    {order.displayID === "GF-985"
                      ? "Abbas"
                      : order && order.eater && order.eater.name
                      ? `Khách hàng: ${String(order.eater.name)}`
                      : "Khách hàng: ***"}
                  </Text>
                  <Text style={styles.orderId}>
                    Order ID: {order.displayID}
                  </Text>
                  <Text style={styles.deliveryTime}>
                    Được tạo lúc:{" "}
                    {new Date(order.createdAt).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Text>
                  <View style={styles.tagsContainer}>
                    {getTags(order).map((tag, index) => (
                      <Text key={index} style={styles.tag}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>

              {/* Status and Platform */}
              {/* <View style={styles.statusRow}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    { backgroundColor: getStatusColor(order.status) },
                  ]}
                >
                  <Text style={[styles.statusText, { color: "white" }]}>
                    {order.deliveryStatus.split("_")[0]}
                  </Text>
                </TouchableOpacity>
              </View> */}

              {/* Order Items */}
              {/* {order.orderDetails &&
                order.orderDetails.itemInfo &&
                order.orderDetails.itemInfo.items &&
                order.orderDetails.itemInfo.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                    </View>
                    <Text style={styles.itemPrice}></Text>
                  </View>
                ))} */}

              {/* Footer with Total */}
              <View style={styles.footer}>
                {/* <Text style={styles.totalItems}>
                  Số món:{" "}
                  {order.orderDetails &&
                  order.orderDetails.itemInfo &&
                  typeof order.orderDetails.itemInfo.count === "number"
                    ? order.orderDetails.itemInfo.count
                    : 0}
                </Text> */}
                {/* <View style={styles.statusRow}> */}
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor: getStatusColor(
                        order.deliveryStatus.split("_")[0]
                      ),
                    },
                  ]}
                >
                  <Text style={[styles.statusText, { color: "white" }]}>
                    {getStatusText(order.deliveryStatus.split("_")[0])}
                  </Text>
                </TouchableOpacity>
                {/* </View> */}
                <Text style={styles.totalPrice}>
                  {(order.orderDetails && order.orderDetails.orderValue) ||
                    (order.cancelledOriginalPriceDisplay &&
                      order.cancelledOriginalPriceDisplay.toLocaleString())}{" "}
                  VND
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  orderList: {
    marginTop: -8,
    width: Dimensions.get("window").width,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 45,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, // Hiệu ứng đổ bóng cho Android
    margin: 24,
  },
  card: {
    backgroundColor: "#F8F8F8",
    borderRadius: 15,
    padding: 16,
    margin: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width: Dimensions.get("window").width - 24,
    height: Dimensions.get("window").height / 4.5, // Reduce the height of the card
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
  },
  loginPrompt: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#FFA000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#F8F8F8",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
    marginTop: 12,
    marginLeft: 8,
  },
  customer: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#F8F8F8",
  },
  orderId: {
    color: "#888",
    paddingTop: 5,
    backgroundColor: "#F8F8F8",
  },
  deliveryTime: {
    color: "#888",
    paddingTop: 5,
    backgroundColor: "#F8F8F8",
  },
  items: {
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 8,
    flexDirection: "row",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  searchInput: {
    height: 40,
    borderColor: "#DDD",
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    width: "50%",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  filterButton: {
    backgroundColor: "#FFA000",
    padding: 8,
    borderRadius: 8,
    marginRight: 8, // Thêm khoảng cách giữa các nút lọc
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  filterButtonText: {
    color: "#FFF",
    fontSize: 14,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "F8F8F8",
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
  platform: {
    backgroundColor: "#FFF3E0",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  platformText: {
    color: "#FFA000",
    fontWeight: "bold",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#F8F8F8",
    marginLeft: 8,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  itemQuantity: {
    color: "#888",
    marginTop: 2,
  },
  itemPrice: {
    fontWeight: "bold",
    color: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
    backgroundColor: "#F8F8F8",
    marginTop: "auto", // This will push the footer to the bottom of the card
  },
  totalItems: {
    fontWeight: "bold",
    color: "#888",
  },
  totalPrice: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#FFA000",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 8,
    position: "relative",
  },
  statImage: {
    width: "100%",
    height: 88,
    borderRadius: 8,
  },
  textContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 8,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: to add a dark overlay
    borderRadius: 8,
    height: "100%",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 14,
    color: "white",
    marginBottom: 8,
  },
  platformLogo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 8,
    backgroundColor: "#F8F8F8",
  },
  tag: {
    backgroundColor: "#fefae0",
    color: "dark",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 12,
  },
});

export default Home;

const example = {
  acceptedViaAA: true,
  acceptedViaCall: false,
  acknowledgedForAA: false,
  allowComplete: false,
  bookingCode: "A-7GCTHINWWEV5",
  busyModeApproach: 0,
  busyModeOrderPickupTime: "2025-02-10T06:31:37.498163377Z",
  cancelBy: "",
  cancelCode: 0,
  cancelRole: "",
  cancelledMsg: "",
  chatroomInfo: { roomID: "b803cd8549e5a9ce0b24b4857b3c674a", status: 0 },
  cutlery: 2,
  deliveryTaskpoolStatus: "COMPLETED",
  dineInInfo: null,
  displayHighlights: { highlightItemCount: false, missingItemIDs: null },
  displayID: "GF-754",
  driver: {
    avatar:
      "https://s3-ap-southeast-1.amazonaws.com/myteksi/grab-id/profile_pic/1/-1/UQ54TOnHVMdl-M9uojDIA1Z5rt0=_2024/11/06_.jpg",
    latitude: 0,
    location: null,
    longitude: 0,
    mobileNumber: "",
    name: "Nguyễn Phi Hùng",
  },
  eater: {
    address: {
      address: "Đông Hội, X.Đông Hội, H.Đông Anh, Hà Nội, 10000, Vietnam",
      keywords: "Chung Cư Eurowindow River Park - Tòa Park 4",
    },
    comment: "",
    mobileNumber: "",
    name: "***",
  },
  fare: {
    adjustmentByDriverDisplay: "",
    adjustmentByDriverInCent: 0,
    cancelledDisplay: "0",
    chargeFeeDescription: {
      en: "Restaurant packaging charge",
      id: "Biaya kemasan",
      ms: "Caj pembungkusan dari restoran",
      th: "ค่าบรรจุภัณฑ",
      vi: "Phí đồ gói mang về",
      zh: "商家包装费",
    },
    currencySymbol: "₫",
    daxPayMexFareDisplay: "0",
    deliveryFeeDisplay: "26.000",
    isIncludeMerchantChargeTax: false,
    merchantChargeDisplay: "",
    mexCommissionDisplay: "21.597",
    passengerTotalDisplay: "116.000",
    promotionDisplay: "40.000",
    reducedPriceDisplay: "119.000",
    revampedSubtotalDisplay: "130.000",
    serviceChargeFeeDescription: {
      en: "Service charge",
      id: "Biaya layanan",
      km: "ការគិតថ្លៃលើសេវាកម្ម",
      ms: "Caj Perkhidmatan",
      my: "ဝန်ဆောင်စရိတ်",
      th: "ค่าบริการ",
      vi: "Phí dịch vụ",
      zh: "服务费",
    },
    serviceChargeFeeDisplay: "",
    smallOrderFeeDisplay: "0",
    subTotalDisplay: "130.000",
    subtotalIncludeMerchantCharge: "130.000",
    taxDisplay: "0",
    taxRate: "0.0000",
    totalDiscountAmountDisplay: "22.000",
    totalDisplay: "108.000",
    totalInCent: 0,
  },
  flags: {
    hideOrderDriverInfo: false,
    isAdsMarketingAttributed: false,
    isGrabInitiatedSplitOrder: false,
    isPaxNewCustomer: false,
    isPayOnCollect: false,
    isPrintOrderRevampReceipt: true,
    merchantFeatureFlags: 0,
    showForceCompleteButton: false,
    showReceiptEaterAddress: false,
  },
  giftInfo: null,
  hasPromo: true,
  incidents: { data: [], hasError: false },
  isBusyModeOrder: false,
  isEditable: false,
  isEditableByPax: false,
  isLargeOrder: false,
  isOrderEdited: false,
  isOrderWithFriends: false,
  isTakeawayOrder: false,
  itemInfo: { count: 2, items: [[Object]], merchantItems: null },
  leadsGenData: {
    deliveryFee: "",
    geAllocationStatus: 0,
    grabExpressDriver: null,
    isDeliverByMex: false,
    isOrderValueLow: false,
    paxDistanceToMex: 4993,
    timeLeftToEnableCompleteButton: 0,
  },
  mcorInfo: {
    correctedOrderReadyAt: null,
    driverCloseToPickingUp: false,
    estimatedOrderReadyAt: "2025-02-10T06:37:44Z",
    isEditable: false,
    maxOrderReadyAt: "2025-02-10T07:16:44Z",
    supportMcor: false,
  },
  membershipID: "",
  merchant: { ID: "5-CZN2A6KHL2UAGA" },
  mexOPT: {
    actualOPT: null,
    estimatedOPTDoneAt: "2025-02-10T06:37:44.629718146Z",
    isPreparationTaskDelayed: false,
    isReadyButtonAbused: false,
    sourceOPT: 1,
    submittedOPTFromMex: 360,
  },
  mexReimbursementInfo: null,
  orderBookings: null,
  orderChangeLog: null,
  orderFlags: 4035792627008801000,
  orderID: "117619925-C66UPEE1EAWYGT",
  orderLevelDiscounts: [
    {
      discountAmountDisplay: "22.000",
      discountAmountValueInMin: 22000,
      discountName: "BOSSCMFH3X4NLIA",
      discountType: "order",
      isNewPromotion: false,
    },
  ],
  orderStatsFlags: 4129,
  payMerchant: false,
  paymentMethod: "Cash",
  preparationTaskID: "117619925-C66UPEE1EAWYGT-PREP-C66UPEE2EKWYGT",
  preparationTaskpoolStatus: "COMPLETED",
  qsrModelType: 2,
  receiptAdditionalInfo: {
    printedCount: 0,
    supportFeatureFlags: { showCashToCollect: false },
  },
  receiptFlags: 0,
  replacementInfo: null,
  scheduledOrderInfo: null,
  stampInfo: { userConsentMsg: "" },
  state: "COMPLETED",
  times: {
    acceptedAt: "2025-02-10T06:31:44Z",
    cancelledAt: null,
    completedAt: "2025-02-10T07:11:20Z",
    createdAt: "2025-02-10T06:31:37Z",
    deliveredAt: "2025-02-10T06:44:41Z",
    displayedAt: "2025-02-10T06:31:44Z",
    driverArriveRestoAt: null,
    expiredAt: "2025-02-10T06:36:37Z",
    preparationCompletedAt: "2025-02-10T06:44:41Z",
    readyAt: "2025-02-10T06:33:31Z",
  },
  uneditableReason: 10,
  voucherInfo: null,
};
