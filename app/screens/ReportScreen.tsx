import { View } from "@/components/Themed";
import { Icon } from "@rneui/base";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, Linking } from "react-native";
import RevenueReportScreen from "./RevenueReportScreen";
import CustomerReportScreen from "./CustomerReportScreen";
import { useRouter } from "expo-router";

const Report = () => {
  const [showRevenueReport, setShowRevenueReport] = useState(false);
  const [showCustomerReport, setShowCustomerReport] = useState(false);
  const router = useRouter();

  const handleRevenueReportPress = () => {
    router.push("/screens/RevenueReportScreen");
  };

  const handleCustomerReportPress = () => {
    router.push("/screens/CustomerReportScreen");
  };

  if (showRevenueReport) {
    return <RevenueReportScreen />;
  }

  if (showCustomerReport) {
    return <CustomerReportScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Báo cáo doanh thu */}
      <TouchableOpacity style={styles.card} onPress={handleRevenueReportPress}>
        <View style={styles.iconWrapper}>
          <Icon name="bar-chart" size={24} color="#000" />
        </View>
        <Text style={styles.text}>Báo cáo doanh thu</Text>
        <Icon name="arrow-forward-ios" size={20} color="#000" />
      </TouchableOpacity>

      {/* Báo cáo khách hàng */}
      <TouchableOpacity style={styles.card} onPress={handleCustomerReportPress}>
        <View style={styles.iconWrapper}>
          <Icon name="person" size={24} color="#000" />
        </View>
        <Text style={styles.text}>Báo cáo khách hàng</Text>
        <Icon name="arrow-forward-ios" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 16,
    margin: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  iconWrapper: {
    marginRight: 16,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
});

export default Report;
