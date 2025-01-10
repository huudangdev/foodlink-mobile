import React, { useRef } from "react";
import { WebView } from "react-native-webview";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const WebViewGrabfoodScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const webViewRef = useRef(null);

  const handleNavigationStateChange = (navState: any, event: any) => {
    console.log("navState:", navState);
    console.log("event:", event);

    // Check if the URL contains the expected callback path
    if (navState.url.includes("callback")) {
      const url = new URL(navState.url);
      const clientId = url.searchParams.get("client_id");
      const clientSecret = url.searchParams.get("client_secret");
      console.log("clientId:", clientId);
      console.log("clientSecret:", clientSecret);

      if (clientId && clientSecret) {
        // Navigate to OrderScreen with the extracted parameters
        navigation.navigate("OrderScreen", { clientId, clientSecret });
      }
    }
  };

  const handleMessage = (event: any) => {
    const { data } = event.nativeEvent;
    console.log("Received message from WebView:", data);

    // Parse the data received from WebView
    const parsedData = JSON.parse(data);
    const { username, password } = parsedData;

    Alert.alert(
      "Thông tin tài khoản",
      `Username: ${username}\nPassword: ${password}`
    );

    // Navigate to OrderScreen with the extracted parameters
    navigation.navigate("OrderScreen", { username, password });
  };

  const injectedJavaScript = `
    (function() {
      document.querySelector('input[name="username"]').addEventListener('input', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          username: document.querySelector('input[name="username"]').value,
          password: document.querySelector('input[name="password"]').value
        }));
      });
      document.querySelector('input[name="password"]').addEventListener('input', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          username: document.querySelector('input[name="username"]').value,
          password: document.querySelector('input[name="password"]').value
        }));
      });
    })();
  `;

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: "https://merchant.grab.com/portal" }} // Replace with the GrabFood Merchant login URL
      onNavigationStateChange={handleNavigationStateChange}
      onMessage={handleMessage}
      injectedJavaScript={injectedJavaScript}
    />
  );
};

export default WebViewGrabfoodScreen;
