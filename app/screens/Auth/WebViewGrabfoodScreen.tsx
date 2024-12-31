// app/screens/WebViewScreen.tsx
import React from "react";
import { WebView } from "react-native-webview";
import { useRoute, useNavigation } from "@react-navigation/native";

const WebViewScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  //const { username, password } = route.params;

  const handleNavigationStateChange = (navState: any) => {
    // Kiểm tra URL để lấy clientId và clientSecret từ phản hồi của API
    if (navState.url.includes("callback")) {
      const urlParams = new URLSearchParams(navState.url.split("?")[1]);
      const clientId = urlParams.get("client_id");
      const clientSecret = urlParams.get("client_secret");

      if (clientId && clientSecret) {
        // Lưu clientId và clientSecret và điều hướng đến màn hình OrderScreen
        navigation.navigate("OrderScreen", { clientId, clientSecret });
      }
    }
  };

  return (
    <WebView
      source={{ uri: "https://merchant.grab.com/login" }} // Thay thế bằng URL đăng nhập của GrabFood Merchant
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
};

export default WebViewScreen;
