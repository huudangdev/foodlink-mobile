import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const stores = [
  {
    id: 1,
    name: "GongCha 01-Nguyễn Văn Linh",
    address: "01 - Nguyễn Văn Linh",
    channels: [
      {
        id: 1,
        name: "GrabFood",
        status: "Chưa kết nối",
        icon: require("../../assets/images/example-item.png"),
      },
      {
        id: 2,
        name: "SPFood",
        status: "Đã kết nối",
        icon: require("../../assets/images/example-item.png"),
      },
    ],
  },
  {
    id: 2,
    name: "GongCha 02-Lê Lợi",
    address: "02 - Lê Lợi",
    channels: [
      {
        id: 1,
        name: "GrabFood",
        status: "Đã kết nối",
        icon: require("../../assets/images/example-item.png"),
      },
      {
        id: 2,
        name: "SPFood",
        status: "Chưa kết nối",
        icon: require("../../assets/images/example-item.png"),
      },
    ],
  },
];

const settings = [
  { id: 1, name: "Thông tin quán", icon: "information-outline" },
  { id: 2, name: "Cài đặt thông tin VNPAY", icon: "pencil-outline" },
  { id: 3, name: "Quản lý thực đơn", icon: "calendar-outline" },
  { id: 4, name: "Nhóm món thêm", icon: "plus-circle-outline" },
  { id: 5, name: "Danh mục giảm giá", icon: "tag-outline" },
  { id: 6, name: "Loại dịch vụ", icon: "apps" },
];

const DrawerScreen = () => {
  const [selectedStore, setSelectedStore] = useState(stores[0]);
  const [isPickerVisible, setPickerVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setPickerVisible(!isPickerVisible)}
      >
        <Image
          source={require("../../assets/images/example-item.png")}
          style={styles.storeImage}
        />
        <View>
          <Text style={styles.storeName}>{selectedStore.name}</Text>
          <Text style={styles.storeAddress}>{selectedStore.address}</Text>
        </View>
      </TouchableOpacity>

      {/* Store Picker */}
      {isPickerVisible && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedStore.id.toString()}
            onValueChange={(itemValue) => {
              const store = stores.find(
                (store) => store.id === Number(itemValue)
              );
              if (store) {
                setSelectedStore(store);
              }
              setPickerVisible(false);
            }}
            style={styles.picker}
          >
            {stores.map((store) => (
              <Picker.Item
                key={store.id}
                label={store.name}
                value={store.id.toString()}
              />
            ))}
          </Picker>
        </View>
      )}

      {/* Menu Items */}
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="star-outline" size={24} color="#555" />
        <Text style={styles.menuText}>Đánh giá</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Icon name="bell-outline" size={24} color="#555" />
        <Text style={styles.menuText}>Cài đặt thông báo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Icon name="printer-outline" size={24} color="#555" />
        <Text style={styles.menuText}>Cài đặt máy in</Text>
      </TouchableOpacity>

      {/* Tích hợp kênh */}
      <Text style={styles.sectionTitle}>Tích hợp kênh</Text>
      {selectedStore.channels.map((channel) => (
        <TouchableOpacity key={channel.id} style={styles.channelItem}>
          <Image source={channel.icon} style={styles.channelIcon} />
          <Text style={styles.channelName}>{channel.name}</Text>
          <Text
            style={
              channel.status === "Đã kết nối"
                ? styles.connected
                : styles.notConnected
            }
          >
            {channel.status}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Cài đặt cửa hàng */}
      <Text style={styles.sectionTitle}>Cài đặt cửa hàng</Text>
      {settings.map((setting) => (
        <TouchableOpacity key={setting.id} style={styles.menuItem}>
          <Icon name={setting.icon} size={24} color="#555" />
          <Text style={styles.menuText}>{setting.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 24 },
  picker: { height: 50, width: "100%" },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 60,
  },
  header: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  storeImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  storeName: { fontSize: 18, fontWeight: "bold" },
  storeAddress: { fontSize: 14, color: "#555" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: { marginLeft: 10, fontSize: 16, color: "#333" },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  channelItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  channelIcon: { width: 30, height: 30, marginRight: 10 },
  channelName: { flex: 1, fontSize: 16, color: "#333" },
  connected: { color: "green", fontWeight: "bold" },
  notConnected: { color: "gray" },
});

export default DrawerScreen;
