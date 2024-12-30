import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AppInfoScreen = () => {
  return (
    <View style={styles.container}>
      {[
        { label: "Tên ứng dụng", value: "POSHUB" },
        { label: "Phiên bản", value: "1.2.5" },
      ].map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  row: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "#000",
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    height: 48,
    textAlignVertical: "center",
  },
});

export default AppInfoScreen;
