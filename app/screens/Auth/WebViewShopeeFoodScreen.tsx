import { useAuth } from "@/app/context/AuthContext";
import { saveShopeeFoodToken } from "@/app/services/auth/authShopeeFood";
import React, { useRef } from "react";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const ShopeeAuthWebView = () => {
  const webViewRef = useRef(null);
  const { user, setUser } = useAuth();
  const navigation = useNavigation();

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log(data);
      if (data.error === 0) {
        console.log("Token (toc_nonce):", data.data.toc_nonce);
        console.log("User Info:", data.data.toc_account);

        // Lưu lại token hoặc xử lý theo nhu cầu
        if (user && user.username && data.data.toc_nonce) {
          await saveShopeeFoodToken(data.data.toc_nonce, user.username);
          await setUser({
            ...user,
            shopeeFoodToken: data.data.toc_nonce || "",
          });
          Alert.alert("Success", "Xác thực thành công", [
            {
              text: "Đồng ý",
              onPress: () => navigation.navigate("(tabs)"),
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };

  const injectScript = `
    (function() {
      const originalFetch = window.fetch;
      window.fetch = function(url, options) {
        return originalFetch(url, options).then((response) => {
          const clone = response.clone();
          clone.json().then((data) => {
            if (data && data.error === 0) {
              window.ReactNativeWebView.postMessage(JSON.stringify(data));
            }
          });
          return response;
        });
      };
    })();
    true;
  `;

  return (
    <WebView
      ref={webViewRef}
      source={{
        uri: "https://partner.business.accounts.shopee.vn/authenticate/login/otp?...",
      }}
      injectedJavaScript={injectScript}
      onMessage={handleMessage}
    />
  );
};

export default ShopeeAuthWebView;
