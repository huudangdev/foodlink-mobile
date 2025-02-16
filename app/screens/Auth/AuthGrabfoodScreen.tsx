import { useAuth } from "@/app/context/AuthContext";
import { loginGrabFood } from "@/app/services/auth/authGrabfood";
import { getStoreInfo } from "@/app/services/storeApi";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";

const LoginScreen = () => {
  const [username, setUsername] = useState("dang.nguyentranhuu@gmail.com");
  const [password, setPassword] = useState("Uit1657421717;");
  const [showPassword, setShowPassword] = useState(false);
  const { user, setUser } = useAuth();

  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    console.log(
      "Logging in with username:",
      username,
      "and password:",
      password
    );

    try {
      await loginGrabFood(username, password, user).then(async (response) => {
        console.log("Login successful:", response.data);
        const storeInfo = await getStoreInfo(response.data.data.jwt);
        setUser({
          username: user?.username || "",
          grabFoodToken: response.data.data.jwt,
          email: user?.email || "",
          storeInfo,
          printers: user?.printers || [],
          shopeeFoodToken: user?.shopeeFoodToken || "",
          notifications: user?.notifications || [],
          jwt: "",
        });
      });

      //navigation.navigate("screens/HomeScreen");
      //router.back();
      Alert.alert("Success", "Xác thực thành công", [
        {
          text: "Đồng ý",
          onPress: () => navigation.navigate("(tabs)"),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        "Login failed. Please check your credentials and try again."
      );
      console.error("Error logging in:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logoText}>
        Grab<Text style={{ fontWeight: "bold" }}>Merchant</Text>
      </Text>

      {/* Login Title */}
      <Text style={styles.title}>Log in to get started</Text>

      {/* Username Input */}
      <Text style={styles.label}>Your username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Your Grab password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        {/* <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.togglePassword}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    margin: 20,
    borderRadius: 10,
  },
  logoText: {
    fontSize: 30,
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "AvenirNext-Bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "AvenirNext-Regular",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
    fontFamily: "AvenirNext-Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    fontFamily: "AvenirNext-Regular",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  togglePassword: {
    marginLeft: 10,
    color: "#2E7D32",
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "AvenirNext-Bold",
  },
});

export default LoginScreen;
