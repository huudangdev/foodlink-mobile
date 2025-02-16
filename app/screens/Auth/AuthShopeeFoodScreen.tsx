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

const ShopeeLoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Xử lý đăng nhập
    Alert.alert("Thông báo", `Username: ${username}, Password: ${password}`);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/spartner.png")}
        style={styles.logo}
      />

      <TextInput
        style={styles.input}
        placeholder="SĐT / Tên người dùng / Email"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={() => Alert.alert("Quên mật khẩu")}>
        <Text style={styles.forgotPassword}>Quên?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          !username || !password ? styles.buttonDisabled : null,
        ]}
        onPress={handleLogin}
        disabled={!username || !password}
      >
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Alert.alert("Đăng nhập với SMS")}>
        <Text style={styles.loginWithSMS}>Đăng nhập với SMS</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Bạn chưa có tài khoản?{" "}
        <Text
          style={styles.registerLink}
          onPress={() => Alert.alert("Đăng ký")}
        >
          Đăng ký ngay.
        </Text>
      </Text>

      <Text style={styles.version}>v3.270.286.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#007BFF",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#f60",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginWithSMS: {
    color: "#007BFF",
    marginBottom: 20,
  },
  registerText: {
    fontSize: 14,
    color: "#000",
  },
  registerLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  version: {
    marginTop: 20,
    color: "#888",
    fontSize: 12,
  },
});

export default ShopeeLoginScreen;
