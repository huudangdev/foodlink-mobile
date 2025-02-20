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
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useOrders } from "../context/OrderContext";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orders } = useOrders();

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
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://52.77.222.212/api/notifications",
          {
            params: { username: user?.username },
          }
        );
        setNotifications(response.data.notifications);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.username) {
      fetchNotifications();
    }
  }, [user]);

  const handleNotificationPress = async (ID) => {
    const order = orders.find((order) => order.ID === ID);
    if (order) {
      router.push({
        pathname: "/screens/OrderDetail",
        params: { info: JSON.stringify(order) },
      });
    } else {
      console.error("Order not found");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error fetching notifications: {error}</Text>;
  }

  const renderNotificationItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item.ID)}>
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
