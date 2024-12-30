import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

const notifications = [
  {
    id: "1",
    platform: "GrabFood",
    icon: require("../../assets/logo/grabfood.png"),
    message:
      "The Fresh Garden - Cold Pressed Juice, Fruit & Coffee - Đường Số 6 Bạn có đơn hàng mới. Tổng 1 món, mã đơn hàng 03104-320033753.",
    time: "Now",
  },
  {
    id: "2",
    platform: "ShopeeFood",
    icon: require("../../assets/logo/shoppefood.png"),
    message:
      "Nắm bắt cơ hội rinh lượng đơn KHỦNG cực dễ duy nhất ngày 10.10 với siêu deal Flash Sale 1K trung khung giờ vàng. Đăng ký tham gia trước 23:59 ngày 06.10!",
    time: "Now",
  },
  // Add more items here if needed
];

const NotificationScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Tất cả");

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Image source={item.icon} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Bạn có 1 đơn hàng mới! #{item.id}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time} ●</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {["Tất cả", "ShopeeFood", "GrabFood"].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, index === 0 && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, index === 0 && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications.filter(
          (item) => selectedTab === "Tất cả" || item.platform === selectedTab
        )}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    elevation: 2,
    width: "100%",
    justifyContent: "flex-start",
  },
  tab: {
    padding: 12,
    alignItems: "center",
    borderRadius: 48,
    backgroundColor: "#f9f9f9",
    elevation: 2,
    marginHorizontal: 4,
    height: 40, // Thêm khoảng cách giữa các tabs
  },
  activeTab: {
    backgroundColor: "#ffc107",
  },
  tabText: {
    fontSize: 14,
    color: "#000",
  },
  activeTabText: {
    color: "#fff",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  message: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
});

export default NotificationScreen;
