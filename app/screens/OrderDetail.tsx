import { Icon } from "@rneui/base";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

const OrderDetailsScreen = () => {
  const [orderStatus, setOrderStatus] = useState("Chờ xác nhận");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const orderItems = [
    {
      id: "1",
      name: "Bánh trung thu Songpyeon",
      quantity: 2,
      price: 45000,
      image: require("../../assets/images/example-item.png"),
    },
    {
      id: "2",
      name: "Bánh Hotteok – bánh Pancake",
      quantity: 2,
      price: 45000,
      image: require("../../assets/images/example-item.png"),
    },
    {
      id: "3",
      name: "Bánh trung thu Songpyeon",
      quantity: 2,
      price: 45000,
      image: require("../../assets/images/example-item.png"),
    },
    {
      id: "4",
      name: "Bánh Hotteok – bánh Pancake",
      quantity: 2,
      price: 45000,
      image: require("../../assets/images/example-item.png"),
    },
    {
      id: "5",
      name: "Bánh Hotteok – bánh Pancake",
      quantity: 2,
      price: 45000,
      image: require("../../assets/images/example-item.png"),
    },
    {
      id: "6",
      name: "Bánh Hotteok – bánh Pancake",
      quantity: 2,
      price: 45000,
      image: require("../../assets/images/example-item.png"),
    },
    {
      id: "7",
      name: "Bánh Hotteok – bánh Pancake",
      quantity: 2,
      price: 45000,
      image: require("../../assets/images/example-item.png"),
    },
    {
      id: "8",
      name: "Bánh Hotteok – bánh Pancake",
      quantity: 2,
      price: 45000,
      image: require("../../assets/images/example-item.png"),
    },
  ];

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);

  const renderOrderItem = ({
    item,
  }: {
    item: {
      id: string;
      name: string;
      quantity: number;
      price: number;
      image: any;
    };
  }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
      </View>
      <Text style={styles.itemPrice}>{item.price.toLocaleString()} VNĐ</Text>
    </View>
  );

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

  const getStatusStyle = () => {
    switch (orderStatus) {
      case "Đã xác nhận":
        return styles.confirmedStatus;
      case "Đã huỷ":
        return styles.cancelledStatus;
      case "Hết món":
        return styles.outOfStockStatus;
      default:
        return styles.defaultStatus;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.customerInfo}>
        <View style={styles.infoCustomer}>
          <Image
            source={require("@/assets/logo/shoppefood.png")}
            style={styles.platformLogo}
          />
          <Text style={styles.customerName}>Nguyễn Cao Nam</Text>
          <View style={[styles.status, getStatusStyle()]}>
            <Text style={styles.statusText}>{orderStatus}</Text>
          </View>
        </View>
        <View style={styles.infoCustomer}>
          <Text style={styles.deliveryTime}>Order ID: GF26493</Text>
          <Text style={styles.deliveryTime}>Giao hàng lúc: 10:00</Text>
        </View>
        <View style={styles.CTA}>
          {/* Call Button */}
          <TouchableOpacity style={styles.button}>
            <Icon name="phone" size={24} color="#555" />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>

          {/* Message Button */}
          <TouchableOpacity style={styles.button}>
            <Icon
              name="comment"
              size={24}
              color="#555"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>

          {/* Print Button */}
          <TouchableOpacity style={styles.button}>
            <Icon name="print" size={24} color="#555" />
            <Text style={styles.buttonText}>Print</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={orderItems}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Số món: {orderItems.length}</Text>
        <Text style={styles.totalAmount}>
          {totalAmount.toLocaleString()} VNĐ
        </Text>
      </View>

      {!isConfirmed && (
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
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Huỷ Đơn</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16, margin: 8 },
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  platformLogo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  customerName: { fontSize: 16, fontWeight: "thin", marginRight: 56 },
  status: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  statusText: {
    color: "#fff",
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
    marginHorizontal: 4,
    marginVertical: 10,
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
    margin: 24,
    borderTopWidth: 1,
    paddingTop: 10,
    borderColor: "#ccc",
    alignItems: "flex-end",
  },
  totalLabel: { fontSize: 16, color: "#555" },
  totalAmount: { fontSize: 18, fontWeight: "bold", color: "#000" },
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
});

export default OrderDetailsScreen;
