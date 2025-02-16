import { View, Text } from "@/components/Themed";
import { Icon } from "@rneui/base";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Image } from "react-native";
import { getGrabFoodOrders } from "../services/grabfood";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import useFetchOrders from "../hooks/useFetchOrders";
import { useOrders } from "../context/OrderContext";

interface Order {
  items: any;
  id: string;
  customer: string;
  status: string;
  platform: string;
  createdAt: string;
  displayID: string;
  deliveryStatus: string;
  orderDetails: {
    eater: {
      name: string;
    };
    itemInfo: {
      items: Array<{
        name: string;
        quantity: number;
        price: {
          toLocaleString: () => string;
        };
      }>;
      count: number;
    };
    orderValue: string;
  };
  cancelledOriginalPriceDisplay?: {
    toLocaleString: () => string;
  };
}

const Order = () => {
  const { orders, loading, error } = useOrders();

  // const [orders, setOrders] = useState<Order[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<Error | null>(null);

  const [selectedPlatform, setSelectedPlatform] = useState("GrabFood");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString()
  );
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [value, setValue] = useState("GrabFood");
  const [open, setOpen] = useState(false);
  const { user, setUser } = useAuth();

  type RouteParams = {
    clientId: string;
    clientSecret: string;
  };

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

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

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
  };

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

  const getTags = (order: any) => {
    const tags: String[] = [];
    if (order.isAcceptedByAA) tags.push("Xác nhận tự động");
    if (order.isTakeawayOrder) tags.push("Đơn tự đến lấy");
    if (order.isOrderEdited) tags.push("Đơn đã chỉnh sửa");
    if (order.isPaxNewCustomer) tags.push("Khách hàng mới");
    if (order.isPreparationTaskDelayed) tags.push("Đơn trễ");
    if (order.isScheduledOrder) tags.push("Đơn đặt trước");
    return tags;
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

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      style={styles.card}
      onPress={() => handleOrderPress(item)}
      key={item.displayID}
    >
      {/* Customer and Order Information */}
      <View style={styles.header}>
        <Image
          source={
            item.platform === "ShopeeFood"
              ? require("@/assets/logo/shoppefood.png")
              : require("@/assets/logo/grabfood.png")
          }
          style={styles.platformLogo}
        />
        <View>
          <Text style={styles.customer}>
            {item && item.eater && item.eater.name
              ? `Khách hàng: ${item.eater.name}`
              : "Khách hàng: ***"}
          </Text>
          <Text style={styles.orderId}>Order ID: {item.displayID}</Text>
          <Text style={styles.deliveryTime}>
            Được tạo lúc:{" "}
            {new Date(item.createdAt).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </Text>
          <View style={styles.tagsContainer}>
            {getTags(item).map((tag, index) => (
              <Text key={index} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* Order Items */}
      {item.orderDetails &&
        item.orderDetails.itemInfo &&
        item.orderDetails.itemInfo.items &&
        item.orderDetails.itemInfo.items.map(
          (
            item: {
              name:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | null
                | undefined;
              quantity:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | null
                | undefined;
              price: {
                toLocaleString: () =>
                  | string
                  | number
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | null
                  | undefined;
              };
            },
            index: React.Key | null | undefined
          ) => {
            return (
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
                </Text>
              </View>
            );
          }
        )}

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
                item.deliveryStatus.split("_")[0]
              ),
            },
          ]}
        >
          <Text style={[styles.statusText, { color: "white" }]}>
            {getStatusText(item.deliveryStatus.split("_")[0])}
          </Text>
        </TouchableOpacity>
        {/* </View> */}
        <Text style={styles.totalPrice}>
          {(item.orderDetails && item.orderDetails.orderValue) ||
            (item.cancelledOriginalPriceDisplay &&
              item.cancelledOriginalPriceDisplay.toLocaleString())}{" "}
          VND
        </Text>
      </View>
    </Pressable>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error?.message}</Text>
      </View>
    );
  }

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

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#6e6e6e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Tìm kiếm theo tên khách hàng hoặc ID..."
            placeholderTextColor="#6e6e6e"
            value={searchTerm}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          margin: 16,
          marginTop: 0,
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
          marginTop: 16,
        }}
      >
        *Danh sách chỉ hiển thị các đơn hàng trong phạm vi 30 ngày.
      </Text>

      {/* List of Orders */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item, index) => index.toLocaleString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0, // Adjust this value as needed
    width: "100%", // Ensure the container takes the full width of the screen
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
  searchContainer: {
    //padding: 16,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 15,
  },
  statusButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  statusText: {
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
    backgroundColor: "#F8F8F8",
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
  searchInput: {
    borderColor: "#DDD",
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    width: "90%",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  filterButton: {
    backgroundColor: "#FFA000",
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  filterButtonText: {
    color: "#FFF",
    fontSize: 14,
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#F8F8F8",
  },
  platformLogo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  customer: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    backgroundColor: "#F8F8F8",
  },
  orderId: {
    color: "#555",
    fontSize: 14,
    backgroundColor: "#F8F8F8",
  },
  status: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 8,
    marginTop: 8,
    backgroundColor: "green",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    alignSelf: "flex-end",
    textTransform: "uppercase",
    marginLeft: 16,
  },
  deliveryTime: {
    fontSize: 14,
    color: "#888",
    backgroundColor: "#F8F8F8",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    backgroundColor: "#F8F8F8",
    padding: 8,
    borderRadius: 4,
  },
  total: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "right",
    marginTop: 10,
    backgroundColor: "#F8F8F8",
  },
  searchBar: {
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
    elevation: 2,
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  listContent: {
    //marginTop: -8,
    width: Dimensions.get("window").width,
    paddingHorizontal: 8,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
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

export default Order;
