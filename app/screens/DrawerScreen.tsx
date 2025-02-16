import React, { useEffect, useState } from "react";
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
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { getStoreInfo } from "../services/storeApi";
import { useFocusEffect } from "@react-navigation/native";

const settings = [
  {
    id: 1,
    name: "Thông tin quán",
    icon: "information-outline",
    link: "Store/StoreScreen",
  },
  {
    id: 2,
    name: "Cài đặt thông tin VNPAY",
    icon: "pencil-outline",
    link: "VNPAYSettings",
    disabled: true,
  },
  {
    id: 3,
    name: "Quản lý thực đơn",
    icon: "calendar-outline",
    link: "MenuManagement",
    disabled: true,
  },
  {
    id: 4,
    name: "Nhóm món thêm",
    icon: "plus-circle-outline",
    link: "AdditionalItems",
    disabled: true,
  },
  {
    id: 5,
    name: "Danh mục giảm giá",
    icon: "tag-outline",
    link: "DiscountCategories",
    disabled: true,
  },
  {
    id: 6,
    name: "Loại dịch vụ",
    icon: "apps",
    link: "ServiceTypes",
    disabled: true,
  },
];

const DrawerScreen = () => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const { user, token, setToken, setUser } = useAuth();
  const [grabFoodToken, setGrabFoodToken] = useState(user?.grabFoodToken);
  const [shopeeFoodToken, setShopeeFoodToken] = useState(user?.shopeeFoodToken);

  useFocusEffect(
    React.useCallback(() => {
      // Cập nhật lại token khi màn hình được focus
      setGrabFoodToken(user?.grabFoodToken);
      setShopeeFoodToken(user?.shopeeFoodToken);
    }, [user])
  );

  const stores = [
    {
      id: 1,
      name: user?.storeInfo?.data?.name
        ? user.storeInfo.data.name
        : "Hãy kết nối FoodApp của bạn",
      address: user?.storeInfo?.data?.address.AddressLine1
        ? user.storeInfo.data.address.AddressLine1
        : "Kết nối Grabfood và ShopeeFood để bắt đầu",
      channels: [
        {
          id: 1,
          name: "GrabFood",
          status:
            user?.grabFoodToken && user?.grabFoodToken !== ""
              ? "Đã kết nối"
              : "Chưa kết nối",
          icon: require("../../assets/logo/grabfood.png"),
        },
        {
          id: 2,
          name: "ShopeeFood",
          status:
            user?.shopeeFoodToken && user?.shopeeFoodToken !== ""
              ? "Đã kết nối"
              : "Chưa kết nối",
          //status: "Chưa kết nối",
          icon: require("../../assets/logo/shoppefood.png"),
        },
      ],
    },
    // {
    //   id: 2,
    //   name: "GongCha 02-Lê Lợi",
    //   address: "02 - Lê Lợi",
    //   channels: [
    //     {
    //       id: 1,
    //       name: "GrabFood",
    //       status: "Đã kết nối",
    //       icon: require("../../assets/images/example-item.png"),
    //     },
    //     {
    //       id: 2,
    //       name: "SPFood",
    //       status: "Chưa kết nối",
    //       icon: require("../../assets/images/example-item.png"),
    //     },
    //   ],
    // },
  ];

  const [selectedStore, setSelectedStore] = useState(stores[0]);

  const handleOnPressPrinterSetting = () => {
    router.push("/screens/PrintSettingScreen");
  };

  const handleOnPressNotification = () => {
    router.push("/screens/Notification");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setPickerVisible(!isPickerVisible)}
      >
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREtb_-6-hNc2JH-lnNmMiL2QwqvdAi9tXywO02IPAsL3MS0l0TxGlwJrRgLTryGnNx1-c&usqp=CAU",
          }}
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
      <TouchableOpacity style={styles.menuItem} disabled>
        <Icon name="star-outline" size={24} color="#555" />
        <Text style={styles.menuText}>Đánh giá</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => handleOnPressNotification()}
      >
        <Icon name="bell-outline" size={24} color="#555" />
        <Text style={styles.menuText}>Cài đặt thông báo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => handleOnPressPrinterSetting()}
      >
        <Icon name="printer-outline" size={24} color="#555" />
        <Text style={styles.menuText}>Cài đặt máy in</Text>
      </TouchableOpacity>

      {/* Tích hợp kênh */}
      <Text style={styles.sectionTitle}>Tích hợp kênh</Text>
      {selectedStore.channels.map((channel) => (
        <TouchableOpacity
          key={channel.id}
          style={styles.channelItem}
          onPress={() => {
            if (channel.status !== "Đã kết nối") {
              if (channel.name === "GrabFood") {
                router.push("/screens/Auth/AuthGrabfoodScreen");
              } else if (channel.name === "ShopeeFood") {
                router.push("/screens/Auth/WebViewShopeeFoodScreen");
              }
            }
          }}
          disabled={channel.status === "Đã kết nối"}
        >
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
        <TouchableOpacity
          key={setting.id}
          style={[styles.menuItem, setting.disabled && styles.disabledItem]}
          onPress={() => {
            router.push(`/screens/${setting.link}`);
          }}
        >
          <Icon name={setting.icon} size={24} color="#555" />
          <Text style={styles.menuText}>{setting.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  picker: { height: 50, width: "100%" },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 10,
    marginLeft: -15,
  },
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
  disabledItem: {
    opacity: 0.5,
  },
});

export default DrawerScreen;
