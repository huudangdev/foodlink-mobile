import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import RNPickerSelect from "react-native-picker-select";
import { useAuth } from "../context/AuthContext";
import { savePrinterToDB } from "../services/print";

type RouteParams = {
  printer: string;
};

const AddPrinterScreen = () => {
  const route = useRoute();
  const { printer } = route.params as RouteParams;

  const { user } = useAuth();

  //console.log("Printer info:", printer);

  const data = JSON.parse(printer);
  const [printerIP, setPrinterIP] = useState(data.ip);
  const [printerName, setPrinterName] = useState(data.name);
  const [printerType, setPrinterType] = useState("customer"); // customer, restaurant, label
  const [printerPort, setPrinterPort] = useState("9100");

  //console.log("user: ", user);

  const savePrinter = async (
    printerName: any,
    printerIP: any,
    printerType: any,
    port: any,
    username: any
  ) => {
    // Lưu thông tin máy in
    if (!username) {
      username = "dang.nguyentranhuu@gmail.com";
    }
    try {
      const result = await savePrinterToDB(
        printerName,
        printerIP,
        printerType,
        port,
        username
      );
      Alert.alert("Thành công", "Lưu máy in thành công");
      //router.back();
      console.log("Printer saved:", result);
    } catch (error) {
      Alert.alert("Lỗi", "Thất bại khi lưu máy in");
      console.error("Error saving printer:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Printer IP */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Địa chỉ IP</Text>

        <TextInput
          style={styles.input}
          value={printerIP}
          onChangeText={setPrinterIP}
          placeholder="Nhập địa chỉ IP"
        />

        <Text style={styles.helperText}>
          Nếu khó khăn trong quá trình cấu hình máy in, vui lòng liên hệ bộ phận
          Hỗ trợ khách hàng hoặc gọi hotline 1900633407
        </Text>
      </View>

      {/* Printer PORT */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Port</Text>
        <TextInput
          style={styles.input}
          value={printerPort}
          onChangeText={setPrinterPort}
          placeholder="Nhập port máy in"
        />
      </View>

      {/* Printer Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tên máy in</Text>
        <TextInput
          style={styles.input}
          value={printerName}
          onChangeText={setPrinterName}
          placeholder="Nhập tên máy in mà bạn muốn để dễ nhận biết"
        />
      </View>

      {/* Printer Type */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Loại máy in</Text>
        <RNPickerSelect
          onValueChange={(value) => setPrinterType(value)}
          items={[
            { label: "In bill cho khách", value: "customer" },
            { label: "In bill cho quán", value: "restaurant" },
            { label: "In tách món cho bếp", value: "kitchen" },
            { label: "In nhãn", value: "label" },
          ]}
          placeholder={{ label: "Chọn loại In", value: "customer" }}
          style={pickerSelectStyles}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          savePrinter(
            printerName,
            printerIP,
            printerType,
            printerPort,
            user?.email
          )
        }
      >
        <Text style={styles.buttonText}>Thêm máy in</Text>
      </TouchableOpacity>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // để đảm bảo text không bị che bởi icon
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    //borderWidth: 0.5,
    //borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // để đảm bảo text không bị che bởi icon
    marginBottom: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    //paddingTop: 50,
  },
  ipContainer: {
    //flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    marginBottom: 30,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  helperText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
    marginTop: 5,
  },
  IpText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  input: {
    height: 48,
    borderColor: "#D3D3D3",
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F8F8F8",
  },
  button: {
    backgroundColor: "#FF9900",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default AddPrinterScreen;
