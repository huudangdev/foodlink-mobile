import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import LoginScreen from "./screens/Auth/LoginScreen";
import WebViewGrabfoodScreen from "./screens/Auth/WebViewGrabfoodScreen";
import OrderScreen from "./screens/OrderScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { Appearance } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Buộc sử dụng chế độ sáng
    Appearance.setColorScheme("light");
  }, []);

  useEffect(() => {
    if (!user) {
      router.replace("screens/Auth/LoginScreen");
    }
  }, [user]);

  return (
    <AuthProvider>
      <OrderProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DefaultTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
            <Stack.Screen name="index" />
            <Stack.Screen name="+not-found" />

            <Stack.Screen
              name="screens/Notification/index"
              options={{
                headerShown: true,
                title: "Thiết lập thông báo",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/Auth/AuthGrabfoodScreen"
              options={{
                headerShown: true,
                title: "Đăng nhập GrabFood",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/Auth/AuthShopeeFoodScreen"
              options={{
                headerShown: true,
                title: "Đăng nhập ShopeeFood",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/Store/StoreScreen"
              options={{
                headerShown: true,
                title: "Thông tin cửa hàng",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/Auth/LoginScreen"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="screens/DrawerScreen"
              options={{
                headerShown: true,
                title: "Cài đặt",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/RevenueReportScreen"
              options={{
                headerShown: true,
                title: "Báo cáo doanh thu",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/CustomerReportScreen"
              options={{
                headerShown: true,
                title: "Báo cáo khách hàng",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/NotificationScreen"
              options={{
                headerShown: true,
                title: "Thông báo",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/OrderDetail"
              options={{
                headerShown: true,
                title: "Chi tiết đơn hàng",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="(tabs)/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="screens/PrintSettingScreen"
              options={{
                headerShown: true,
                title: "Danh sách máy in",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/AddPrinterScreen"
              options={{
                headerShown: true,
                title: "Thêm máy in",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/UpdatePrinterScreen"
              options={{
                headerShown: true,
                title: "Cập nhật máy in",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/Auth/WebViewShopeeFoodScreen"
              options={{
                headerShown: true,
                title: "Đăng nhập ShopeeFood",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/EditInfoScreen"
              options={{
                headerShown: true,
                title: "Thông tin tài khoản",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/ChangePasswordScreen"
              options={{
                headerShown: true,
                title: "Đổi mật khẩu",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/AppInfoScreen"
              options={{
                headerShown: true,
                title: "Thông tin ứng dụng",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="screens/Store/TermScreen"
              options={{
                headerShown: true,
                title: "Điều khoản sử dụng",
                headerBackTitle: "Trở lại",
              }}
            />
          </Stack>
        </ThemeProvider>
      </OrderProvider>
    </AuthProvider>
  );
}
