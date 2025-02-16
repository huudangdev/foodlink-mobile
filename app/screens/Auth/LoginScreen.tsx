import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import logo from "@/assets/images/logo.jpg";
import { useEffect } from "react";
import { login } from "../../services/auth/authApi";
import { useAuth } from "@/app/context/AuthContext";

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState(
    "dang.nguyentranhuu@gmail.com"
  );
  const [password, setPassword] = useState("Uit1657421717;");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<any>();
  const { setToken, setUser } = useAuth();

  const handleLogin = async () => {
    console.log(
      "Logging in with phone:",
      phoneNumber,
      "and password:",
      password
    );
    try {
      const response = await login(phoneNumber, password);
      console.log("Login successful:", response.token, response.user.username);

      setToken(response.token); // Lưu token vào bộ nhớ cục bộ
      setUser(response.user); // Lưu thông tin người dùng vào bộ nhớ cục bộ

      // Điều hướng đến màn hình chính hoặc màn hình khác sau khi đăng nhập thành công
      navigation.navigate("(tabs)");
    } catch (error) {
      Alert.alert("Error", "Đăng nhập thất bại, sai tài khoản hoặc mật khẩu.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Đăng nhập</Text>
      <Text style={styles.subtitle}>
        Vui lòng nhập số điện thoại/email và mật khẩu để đăng nhập
      </Text>

      {/* Input Fields */}
      <Text style={styles.label}>Số điện thoại / Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
      />

      {/* Quên mật khẩu */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      {/* Đăng nhập button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity>
          <Text style={styles.contactUs}>Hãy liên hệ chúng tôi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 140,
    backgroundColor: "#fff",
  },
  logo: {
    width: 120,
    height: 60,
    resizeMode: "contain",
    alignSelf: "flex-start",
    marginBottom: 20,
    marginLeft: -16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 8,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "left",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 48,
    borderColor: "#D3D3D3",
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputFocused: {
    borderColor: "#FFA500",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#FFA500",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#FFA500",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  contactUs: {
    color: "#FFA500",
    fontWeight: "bold",
  },
});

export default LoginScreen;
