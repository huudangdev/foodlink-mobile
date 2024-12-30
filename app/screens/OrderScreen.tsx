import { View, Text } from "@/components/Themed";
import { FontAwesome, EvilIcons } from "@expo/vector-icons";
import { Divider } from "@rneui/themed";
import Icon from "@rneui/themed/dist/Icon";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Image } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { authenticateGrabFood, getGrabFoodOrders } from "../services/grabfood";

const Order = () => {
  // const [orders, setOrders] = useState([
  //   {
  //     id: "GF2047",
  //     customer: "Nguyễn Cao Nam",
  //     deliveryTime: "10:00",
  //     platform: "ShopeeFood",
  //     items: [
  //       { name: "Bánh trung thu Songpyeon", price: 45000, quantity: 2 },
  //       { name: "Bánh Hotteok – bánh Pancake", price: 45000, quantity: 2 },
  //     ],
  //     totalItems: 4,
  //     totalPrice: 180000,
  //     status: "Đơn mới",
  //   },
  //   {
  //     id: "GF2040",
  //     customer: "Nguyễn Cao Nam",
  //     deliveryTime: "10:00",
  //     platform: "ShopeeFood",
  //     items: [
  //       { name: "Bánh trung thu Songpyeon", price: 45000, quantity: 2 },
  //       { name: "Bánh Hotteok – bánh Pancake", price: 45000, quantity: 2 },
  //     ],
  //     totalItems: 4,
  //     totalPrice: 180000,
  //     status: "Đơn mới",
  //   },
  //   {
  //     id: "GF2048",
  //     customer: "Nguyễn Văn An",
  //     deliveryTime: "11:00",
  //     platform: "GrabFood",
  //     items: [
  //       { name: "Bánh mì chay", price: 35000, quantity: 3 },
  //       { name: "Cơm rang dưa bò", price: 50000, quantity: 1 },
  //     ],
  //     totalItems: 4,
  //     totalPrice: 200000,
  //     status: "Đang xử lý",
  //   },
  //   {
  //     id: "GF2049",
  //     customer: "Nguyễn Thị Lan",
  //     deliveryTime: "12:00",
  //     platform: "ShopeeFood",
  //     items: [
  //       { name: "Bánh xèo", price: 40000, quantity: 2 },
  //       { name: "Cơm hến", price: 30000, quantity: 2 },
  //     ],
  //     totalItems: 4,
  //     totalPrice: 140000,
  //     status: "Đã hoàn thành",
  //   },
  //   {
  //     id: "GF2050",
  //     customer: "Nguyễn Văn B",
  //     deliveryTime: "13:00",
  //     platform: "GrabFood",
  //     items: [
  //       { name: "Bánh mì chay", price: 35000, quantity: 3 },
  //       { name: "Cơm rang dưa bò", price: 50000, quantity: 1 },
  //     ],
  //     totalItems: 4,
  //     totalPrice: 200000,
  //     status: "Đơn mới",
  //   },
  //   {
  //     id: "GF2051",
  //     customer: "Nguyễn Thị C",
  //     deliveryTime: "14:00",
  //     platform: "ShopeeFood",
  //     items: [
  //       { name: "Bánh xèo", price: 40000, quantity: 2 },
  //       { name: "Cơm hến", price: 30000, quantity: 2 },
  //     ],
  //     totalItems: 4,
  //     totalPrice: 140000,
  //     status: "Đang xử lý",
  //   },
  // ]);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const [searchText, setSearchText] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("ShopeeFood");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Đơn mới");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString()
  );
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [value, setValue] = useState("ShopeeFood");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const clientId = "YOUR_CLIENT_ID"; // Thay thế bằng client_id của bạn
        const clientSecret = "YOUR_CLIENT_SECRET"; // Thay thế bằng client_secret của bạn

        // Xác thực và lấy token
        const accessToken = await authenticateGrabFood(clientId, clientSecret);

        // Lấy đơn hàng
        const ordersData = await getGrabFoodOrders(accessToken);
        setOrders(ordersData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, selectedStatus, selectedPlatform]);

  const handleOrderPress = () => {
    router.push("/screens/OrderDetail");
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    if (selectedPlatform !== "All") {
      filtered = filtered.filter(
        (order) => order.platform === selectedPlatform
      );
    }

    setFilteredOrders(filtered);
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  const handleFilter = (status: string) => {
    setSelectedStatus(status);
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
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

  const renderItem = ({ item }: { item: any }) => (
    <Pressable style={styles.card} onPress={handleOrderPress}>
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
          <Text style={styles.customer}>{item.customer}</Text>
          <Text style={styles.orderId}>Order ID: {item.id}</Text>
          <Text style={styles.deliveryTime}>
            Giao hàng lúc: {item.deliveryTime}
          </Text>
        </View>
      </View>

      {/* Status and Platform */}
      <View style={styles.statusRow}>
        <TouchableOpacity
          style={[
            styles.statusButton,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={[styles.statusText, { color: "white" }]}>
            {item.status}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Order Items */}
      {item.items.map(
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
        ) => (
          <View key={index} style={styles.itemRow}>
            <Image
              source={{ uri: "https://via.placeholder.com/50" }}
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
              {item.price.toLocaleString()} VND
            </Text>
          </View>
        )
      )}

      {/* Footer with Total */}
      <View style={styles.footer}>
        <Text style={styles.totalItems}>Số món: {item.totalItems}</Text>
        <Text style={styles.totalPrice}>
          {item.totalPrice.toLocaleString()} VND
        </Text>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
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
            marginTop: 8,
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
              Đơn mới
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
                  selectedStatus === "Đơn hoàn thành" ? "#FFA000" : "#F5F5F5",
                paddingHorizontal: 16,
                paddingVertical: 8,
              },
            ]}
            onPress={() => handleFilter("Đơn hoàn thành")}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color:
                    selectedStatus === "Đơn hoàn thành" ? "white" : "black",
                },
              ]}
            >
              Đơn hoàn thành
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List of Orders */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    marginBottom: 8,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    elevation: 2,
    paddingHorizontal: 32,
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
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    marginVertical: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
  },
  orderId: {
    color: "#555",
    fontSize: 14,
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
    paddingBottom: 16,
    margin: 24,
    marginTop: 0,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default Order;
