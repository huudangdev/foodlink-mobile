import React, { useEffect, useState } from "react";
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
import axios from "axios";

type RouteParams = {
  printer: string;
};

const UpdatePrinterScreen = () => {
  const route = useRoute();
  const { user, setUser } = useAuth();
  const [printerId, setPrinterId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [type, setType] = useState("");
  const [port, setPort] = useState("");

  useEffect(() => {
    // Kiểm tra xem có thông tin máy in nào được truyền vào không
    const { printer } = route.params as RouteParams || {};
    const data = JSON.parse(printer);
    if (data) {
      setPrinterId(data.index);
      setName(data.name);
      setIp(data.ip);
      setType(data.type);
      setPort(data.port);
    }
  }, [route.params]);

  const handleSubmit = async () => {
    try {
        // Cập nhật máy in đã lưu
        await axios.put(`http://52.77.222.212/api/update-printer/${printerId}`, {
          name,
          ip,
          type,
          port,
          username: user?.username,
        });
        setUser((prevUser) => ({
        ...prevUser,
        printers: prevUser?.printers.map((printer) => 
          printer.index === printerId 
            ? { ...printer, name, ip, type, port } 
            : printer
        )
      }));
        Alert.alert("Thành công", "Cập nhật máy in thành công");
        router.back();
    } catch (error) {
      console.error("Error saving printer:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi lưu máy in");
    }
  };

  return (
    <View style={styles.container}>
      {/* Printer IP */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Địa chỉ IP</Text>

        <TextInput
          style={styles.input}
          value={ip}
          onChangeText={setIp}
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
          value={port}
          onChangeText={setPort}
          placeholder="Nhập port máy in"
        />
      </View>

      {/* Printer Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tên máy in</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập tên máy in mà bạn muốn để dễ nhận biết"
        />
      </View>

      {/* Printer Type */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Loại máy in</Text>
        <RNPickerSelect
          onValueChange={(value) => setType(value)}
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
        onPress={() => handleSubmit()}
      >
        <Text style={styles.buttonText}>Cập nhật máy in</Text>
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

export default UpdatePrinterScreen;
