import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const LoginScreen = () => {
  const [phone, setPhone] = useState("0386968950");
  const [password, setPassword] = useState("Happy2Code$T");
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = phone.length > 0 && password.length > 0;

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Đăng nhập</Text>
      <Text style={styles.subtitle}>
        Vui lòng nhập số điện thoại và mật khẩu để đăng nhập
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mật khẩu</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconContainer}
          >
            <Icon
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#ccc"
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.loginButton, isFormValid && styles.loginButtonActive]}
        disabled={!isFormValid}
        onPress={() => {
          console.log("Login button pressed");
          console.log("Phone:", phone);
          console.log("Password:", password);
          router.back();
        }}
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
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 180,
    height: "10%",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 8,
    color: "#ff3e00",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 10,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#f0a500",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
  },
  forgotPassword: {
    color: "#f0a500",
    textAlign: "right",
    marginBottom: 20,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  loginButtonActive: {
    backgroundColor: "#f0a500",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
  },
  contactUs: {
    color: "#f0a500",
    fontWeight: "bold",
  },
});

export default LoginScreen;
