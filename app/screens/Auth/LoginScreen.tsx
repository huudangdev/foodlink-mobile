// app/screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { login } from "../../services/auth/authApi";
import Icon from "react-native-vector-icons/MaterialIcons"; // Sử dụng gói biểu tượng cụ thể
import { setToken } from "@/app/utils/auth";
import { useAuth } from "@/app/context/AuthContext";
import { routeToScreen } from "expo-router/build/useScreens";

const LoginScreen = () => {
  const [phone, setPhone] = useState("dang.nguyentranhuu");
  const [password, setPassword] = useState("Uit1657421717;");
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigation = useNavigation<any>();
  const { setToken, setUser } = useAuth();

  const handleLogin = async () => {
    console.log("Logging in with phone:", phone, "and password:", password);
    try {
      const response = await login(phone, password);
      console.log("Login successful:", response);

      setToken(response.token); // Lưu token vào bộ nhớ cục bộ
      setUser(response.user); // Lưu thông tin người dùng vào bộ nhớ cục bộ

      // Điều hướng đến màn hình chính hoặc màn hình khác sau khi đăng nhập thành công
      navigation.navigate("(tabs)");
    } catch (error) {
      Alert.alert(
        "Error",
        "Login failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconContainer}
        >
          <Icon
            name={showPassword ? "visibility-off" : "visibility"}
            size={20}
            color="#ccc"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.loginButton, isFormValid && styles.loginButtonActive]}
        //disabled={!isFormValid}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Bạn chưa có tài khoản?{" "}
        <Text style={styles.contactUs}>Hãy liên hệ chúng tôi</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    right: 16,
  },
  forgotPassword: {
    color: "#FFA000",
    marginBottom: 16,
  },
  loginButton: {
    width: "100%",
    padding: 16,
    backgroundColor: "#FFA000",
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonActive: {
    backgroundColor: "#FF8C00",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 16,
    fontSize: 14,
    color: "#555",
  },
  contactUs: {
    color: "#FFA000",
    fontWeight: "bold",
  },
});

export default LoginScreen;
