import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  Alert,
  Linking,
} from "react-native";
import * as Notifications from "expo-notifications";
import { saveTokenExpoNoti } from "../../services/notification";
import { useAuth } from "@/app/context/AuthContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NotificationSettings = () => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  async function checkNotificationPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    setIsNotificationEnabled(status === "granted");
  }

  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      console.log("Requesting permission for notifications");
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Thất bại", "Không thể cấp quyền thông báo.");
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Token Noti: ", token);

    await saveTokenExpoNoti(token, user?.username ?? "");
  }

  const toggleSwitch = async () => {
    if (!isNotificationEnabled) {
      await registerForPushNotificationsAsync();
      await checkNotificationPermissions();
    } else {
      Alert.alert(
        "Tắt thông báo",
        "Vui lòng tắt quyền thông báo từ cài đặt của thiết bị.",
        [
          {
            text: "Hủy",
            style: "cancel",
          },
          {
            text: "Đi đến cài đặt",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      setIsNotificationEnabled(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Cho phép thông báo</Text>
        <Switch
          value={isNotificationEnabled}
          onValueChange={toggleSwitch}
          trackColor={{ false: "#d3d3d3", true: "#4cd964" }}
          thumbColor={isNotificationEnabled ? "#ffffff" : "#ffffff"}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  label: {
    fontSize: 16,
  },
});

export default NotificationSettings;
