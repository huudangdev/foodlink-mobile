import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const ChangePasswordScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        {["Mật khẩu cũ", "Mật khẩu mới", "Nhập lại mật khẩu mới"].map(
          (label, index) => (
            <View key={index} style={styles.inputContainer}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="************"
              />
            </View>
          )
        )}
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    justifyContent: "space-between",
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#fff",
    height: 44,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#f5a623",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ChangePasswordScreen;
