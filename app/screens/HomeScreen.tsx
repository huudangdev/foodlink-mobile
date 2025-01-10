import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import { View, Text } from "@/components/Themed";
import {
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
} from "react-native";
import { Icon } from "@rneui/themed/dist/Icon";
import { router, useNavigation } from "expo-router";
import { getGrabFoodOrders } from "../services/grabfood";
import { useAuth } from "../context/AuthContext";

interface Order {
  displayID: ReactNode;
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
  const [orders, setOrders] = useState<Order[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [selectedStatus, setSelectedStatus] = useState("Đơn mới");
  const [open, setOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("ShopeeFood");
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const endTime = new Date().toISOString();
        const startTime = new Date(
          new Date().setDate(new Date().getDate() - 29)
        ).toISOString();
        const pageIndex = 0;
        const pageSize = 100;
        const grabFoodToken = user?.grabFoodToken;

        console.log(
          "GrabFood access token on Home:",
          grabFoodToken,
          "Start time:",
          startTime,
          "End time:",
          endTime
        );

        // Lấy danh sách order
        const ordersData = await getGrabFoodOrders(
          startTime,
          endTime,
          pageIndex,
          pageSize,
          grabFoodToken
        );
        setOrders(ordersData.statements);
      } catch (error) {
        setError(error);
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 10000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
    //console.log("orders:", orders);
  }, [user]);

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
      params: { order: JSON.stringify(order) },
    });
  };

  // const navigation = useNavigation();

  // const handleOrderPress = (order: Order) => {
  //   navigation.navigate("OrderDetail", { order });
  // };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    const filtered = orders.filter(
      (order) =>
        order.customer.toLowerCase().includes(text.toLowerCase()) ||
        order.id.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleFilter = (status: string) => {
    setSelectedStatus(status);
    const filtered = orders.filter((order) => order.status === status);
    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đơn mới":
        return "#FFA000"; // Amber
      case "Đã hoàn thành":
        return "#4CAF50"; // Green
      case "Đang xử lý":
        return "#2196F3"; // Blue
      default:
        return "#000000"; // Black
    }
  };

  return (
    <View style={styles.container}>
      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          {
            label: "Đơn hàng",
            value: "2",
            image: require("../../assets/images/order-background.jpg"),
          },
          {
            label: "Doanh thu",
            value: "0 VNĐ",
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
          placeholder="Search your order"
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
              backgroundColor:
                selectedStatus === "Đơn mới" ? "#FFA000" : "#F5F5F5",
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginRight: 8,
            },
          ]}
          onPress={() => handleFilter("Đơn mới")}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: selectedStatus === "Đơn mới" ? "white" : "black" },
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
                selectedStatus === "Đang xử lý" ? "#FFA000" : "#F5F5F5",
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginRight: 8,
            },
          ]}
          onPress={() => handleFilter("Đang xử lý")}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: selectedStatus === "Đang xử lý" ? "white" : "black" },
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
                selectedStatus === "Đã hoàn thành" ? "#FFA000" : "#F5F5F5",
              paddingHorizontal: 16,
              paddingVertical: 8,
            },
          ]}
          onPress={() => handleFilter("Đã hoàn thành")}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: selectedStatus === "Đã hoàn thành" ? "white" : "black" },
            ]}
          >
            Đã hoàn thành
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        style={[styles.orderList, { marginLeft: 0 }]}
      >
        {orders.map((order, index) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleOrderPress(order)}
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
                  {order.orderDetails &&
                    order.orderDetails.eater &&
                    order.orderDetails.eater.name}
                </Text>
                <Text style={styles.orderId}>Order ID: {order.displayID}</Text>
                <Text style={styles.deliveryTime}>
                  Được tạo lúc: {new Date(order.createdAt).toLocaleTimeString()}
                </Text>
              </View>
            </View>

            {/* Status and Platform */}
            <View style={styles.statusRow}>
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
              {/* <View style={styles.platform}>
                <Text style={styles.platformText}>{order.platform}</Text>
              </View> */}
            </View>

            {/* Order Items */}
            {order.orderDetails &&
              order.orderDetails.itemInfo &&
              order.orderDetails.itemInfo.items &&
              order.orderDetails.itemInfo.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  {/* <Image
                    source={{ uri: "https://via.placeholder.com/50" }}
                    style={styles.itemImage}
                  /> */}
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    {/* {item.price.toLocaleString()} VND */}
                    75.000 VND
                  </Text>
                </View>
              ))}

            {/* Footer with Total */}
            <View style={styles.footer}>
              <Text style={styles.totalItems}>
                Số món:{" "}
                {order.orderDetails &&
                order.orderDetails.itemInfo &&
                typeof order.orderDetails.itemInfo.count === "number"
                  ? order.orderDetails.itemInfo.count
                  : 0}
              </Text>
              <Text style={styles.totalPrice}>
                {(order.orderDetails && order.orderDetails.orderValue) ||
                  (order.cancelledOriginalPriceDisplay &&
                    order.cancelledOriginalPriceDisplay.toLocaleString())}{" "}
                VND
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orderList: {
    marginTop: -8,
    width: Dimensions.get("window").width,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    width: Dimensions.get("window").width - 24,
    height: Dimensions.get("window").height / 2.5, // Reduce the height of the card
  },
  header: {
    flexDirection: "row",
    marginBottom: 10,
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
  },
  orderId: {
    color: "#888",
    marginTop: 5,
  },
  deliveryTime: {
    color: "#888",
    marginTop: 5,
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
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
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
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
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
});

export default Home;
function setError(error: unknown) {
  throw new Error("Function not implemented.");
}

function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
