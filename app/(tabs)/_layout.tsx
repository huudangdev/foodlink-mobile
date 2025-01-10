import React, { useEffect, useState } from "react";
import { Link, router, Tabs, useNavigation } from "expo-router";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import OrderHeader from "@/components/headers/OrderHeader";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { getToken } from "../utils/auth";
import { AuthProvider, useAuth } from "../context/AuthContext";

const Drawer = createDrawerNavigator();

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  focused: boolean;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const handleNotificationPress = () => {
  router.push("/screens/NotificationScreen");
};

function CustomHeader() {
  return (
    <View style={styles.headerContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.push("/screens/DrawerScreen");
          }}
        >
          <Image
            source={require("../../public/icons/bar.png")}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Hub</Text>
        <TouchableOpacity
          style={styles.notificationContainer}
          onPress={handleNotificationPress}
        >
          <Image
            source={require("../../public/icons/notification.png")}
            style={{ width: 40, height: 40 }}
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const navigation = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { token } = useAuth();

  // useEffect(() => {
  //   if (!token) {
  //     router.push("/screens/Auth/LoginScreen");
  //   }
  // }, [token]);

  // if (!token) {
  //   return null; // Hoặc bạn có thể hiển thị một màn hình chờ
  // }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          header: CustomHeader,
          tabBarIcon: ({ color, focused }) => (
            <View>
              {focused ? (
                <Image
                  source={require("../../public/icons/home-active.png")}
                  style={{ width: 24, height: 24 }}
                />
              ) : (
                <Image
                  source={require("../../public/icons/home.png")}
                  style={{ width: 24, height: 24 }}
                />
              )}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          header: (props: BottomTabHeaderProps) => (
            <OrderHeader
              open={false}
              setOpen={function (value: React.SetStateAction<boolean>): void {
                throw new Error("Function not implemented.");
              }}
              selectedPlatform={""}
              handlePlatformChange={function (value: string): void {
                throw new Error("Function not implemented.");
              }}
              {...props}
            />
          ),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Image
                source={require("../../public/icons/order-active.png")}
                style={{ width: 24, height: 24 }}
              />
            ) : (
              <Image
                source={require("../../public/icons/order.png")}
                style={{ width: 24, height: 24 }}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Báo cáo",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Image
                source={require("../../public/icons/report-active.png")}
                style={{ width: 24, height: 24 }}
              />
            ) : (
              <Image
                source={require("../../public/icons/report.png")}
                style={{ width: 24, height: 24 }}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Tài khoản",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Image
                source={require("../../public/icons/user-active.png")}
                style={{ width: 24, height: 24 }}
              />
            ) : (
              <Image
                source={require("../../public/icons/user.png")}
                style={{ width: 24, height: 24 }}
              />
            ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "#FEAA00",
    borderRadius: 6,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContainer: {
    position: "relative",
  },
  badgeText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
  },
  headerContainer: {
    justifyContent: "center",
    backgroundColor: "white",
    alignItems: "center",
    marginTop: 60,
    height: 60,
  },
  headerTitle: {
    color: "dark",
    fontSize: 16,
  },
  drawerContent: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  menuItem: {
    marginBottom: 15,
  },
  subMenu: {
    marginLeft: 10,
  },
});
