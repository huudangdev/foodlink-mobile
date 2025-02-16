import React, { ReactNode, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  AppState,
  AppStateStatus,
} from "react-native";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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

const NotificationScreen = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("Tất cả");
  const [notifications, setNotifications] = useState(
    user?.notifications.filter(
      (notification: any) =>
        notification.title === "Đơn hàng mới" ||
        notification.title === "Đơn hàng cập nhật"
    ) || []
  );

  interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    icon: any;
    details: any;
  }

  //const [notifications, setNotifications] = useState<Notification[]>([]);

  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    setNotifications(user?.notifications as Notification);
  }, [user]);

  useEffect(() => {
    if (
      (user?.grabFoodToken && user?.grabFoodToken !== "") ||
      (user?.shopeeFoodToken && user?.shopeeFoodToken !== "")
    ) {
      // if (appState === "active" || appState === "background") {
      //   const interval = setInterval(checkOrders, 10000); // Kiểm tra mỗi 10 giây
      //   checkOrders();
      //   return () => clearInterval(interval);
      // }
    }
  }, [appState]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      setAppState(nextAppState);
    }
    if (nextAppState === "background") {
      setAppState(nextAppState);
    }
  };

  const checkOrders = async () => {
    const endTime = new Date().toISOString();
    const startTime = new Date(
      new Date().setDate(new Date().getDate() - 29)
    ).toISOString();
    const pageIndex = 0;
    const pageSize = 100;
    try {
      const response = await axios.get(
        "https://foodlink-api.onrender.com/check-orders",
        {
          params: {
            startTime,
            endTime,
            pageIndex,
            pageSize,
            grabFoodToken: user?.grabFoodToken,
            username: user?.username,
          },
        }
      );

      const { newOrders, updatedOrders } = response.data;

      const newNotifications = [
        ...newOrders.map((order: any) => ({
          id: order.orderID,
          title: "Đơn hàng mới",
          message: `Bạn có đơn hàng mới.`,
          time: new Date(order.createdAt).toLocaleTimeString(),
          icon: require("../../assets/logo/grabfood-square.png"),
          details: order,
        })),
        ...updatedOrders.map((order: any) => ({
          id: order.orderID,
          title: "Đơn hàng cập nhật",
          message: `Đơn hàng #${order.displayID} đã được cập nhật.`,
          time: new Date(order.updatedAt).toLocaleTimeString(),
          icon: require("../../assets/logo/grabfood-square.png"),
          details: order,
        })),
      ];

      setNotifications((prevNotifications: any) => [
        ...newNotifications,
        ...prevNotifications,
      ]);

      // Gửi thông báo cho các đơn hàng mới
      for (const order of newOrders) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Đơn hàng mới",
            body: `Bạn có đơn hàng mới - ${order.displayID}`,
          },
          trigger: null,
        });
      }

      // Gửi thông báo cho các đơn hàng được cập nhật
      for (const order of updatedOrders) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Đơn hàng cập nhật",
            body: `Đơn hàng #${order.displayID} đã được cập nhật.`,
          },
          trigger: null,
        });
      }
    } catch (error) {
      console.error("Error checking orders:", error);
      //Alert.alert("Error", "Failed to check orders.");
    }
  };

  const handleOrderPress = (order: Order) => {
    router.push({
      pathname: "/screens/OrderDetail",
      params: { info: JSON.stringify(order) },
    });
  };

  const renderNotificationItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      //style={styles.notificationCard}
      onPress={() => {
        if (item.details) handleOrderPress(item.details);
        else return;
      }}
    >
      <View style={styles.notificationCard}>
        {item.type === "system" ? (
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.icon}
          />
        ) : (
          <Image
            source={require("../../assets/logo/grabfood-square.png")}
            style={styles.icon}
          />
          // <Image source={item.icon} style={styles.icon} />
        )}

        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.time}>
            {item.time || new Date(item.createdAt).toLocaleTimeString()} ●{" "}
            GrabMerchant
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {["Tất cả", "GrabFood", "ShopeeFood"].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item, index) => index.toLocaleString()}
        contentContainerStyle={styles.notificationList}
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
    justifyContent: "space-around",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tab: {
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FFA000",
  },
  tabText: {
    fontSize: 16,
    color: "#333",
  },
  activeTabText: {
    color: "#FFA000",
  },
  notificationList: {
    padding: 10,
  },
  notificationCard: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "#666",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
});

export default NotificationScreen;
