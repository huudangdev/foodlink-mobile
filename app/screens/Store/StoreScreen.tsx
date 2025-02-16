import { useAuth } from "@/app/context/AuthContext";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const StoreScreen = () => {
  const { user } = useAuth();

  const storeInfo = user?.storeInfo?.data || {};

  //console.log("Store Info:", user?.storeInfo);

  return (
    <View style={styles.container}>
      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Store Info */}
        <View style={styles.storeInfo}>
          {/* <Image
            source={{ uri: "https://via.placeholder.com/80" }} // Replace with the store image URL
            style={styles.storeImage}
          /> */}
          <Text style={styles.storeName}>{storeInfo?.name}</Text>
          <Text style={styles.storeAddress}>
            {storeInfo?.address?.AddressLine1}
          </Text>
        </View>

        {/* Operation Hours */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="time-outline" size={20} color="#000" />
            <Text style={styles.sectionTitle}>Giờ hoạt động</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Thời gian giao hàng</Text>
          <Text style={styles.sectionValue}>08:00 - 17:00</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="person-outline" size={20} color="#000" />
            <Text style={styles.sectionTitle}>
              Thông tin liên hệ của chủ/ quản lý quán
            </Text>
          </View>
          <Text style={styles.sectionValue}>{storeInfo.mobileNumber}</Text>
          <Text style={styles.sectionValue}>{storeInfo.email}</Text>
        </View>

        {/* Store Phone */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="call-outline" size={20} color="#000" />
            <Text style={styles.sectionTitle}>Số điện thoại của quán</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Hãy cung cấp số điện thoại để khách hàng liên hệ với bạn
          </Text>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="location-outline" size={20} color="#000" />
            <Text style={styles.sectionTitle}>Địa chỉ</Text>
          </View>
          <Text style={styles.sectionValue}>
            {storeInfo?.address?.AddressLine1}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 24,
  },
  storeInfo: {
    alignItems: "flex-start",
    marginBottom: 48,
  },
  storeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  storeAddress: {
    fontSize: 14,
    color: "#888",
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#000",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#888",
  },
  sectionValue: {
    fontSize: 14,
    color: "#000",
    marginTop: 5,
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  navLabelActive: {
    color: "#f0a500",
  },
});

export default StoreScreen;

const example = {
  data: {
    address: {
      AddressLine1:
        "Số 4E đường số 6, Khu Phố 4, Phường An Phú, Quận 2, thành phố Hồ Chí Minh",
      AddressLine2:
        "Số 4E đường số 6, Khu Phố 4, Phường An Phú, Quận 2, thành phố Hồ Chí Minh",
      City: "Ho Chi Minh",
      GeoLocation: [Object],
    },
    analytics_id: "e89d922ca6864da39b5163fc41b9e5c3",
    balance: 0,
    balanceLimit: 0,
    bank_details: {
      account_name: "CÔNG TY TNHH THE FRESH GARDEN",
      account_number: "....8016",
      bank_name: "Techcombank",
    },
    config: {},
    correspondence_email: "nguyenhuyen184.neu@gmail.com",
    currency: "",
    email: "nguyenhuyen184.neu@gmail.com",
    mobileNumber: "84936439855",
    name: "Green Food",
    nmid: "",
    qrBackgroundImage:
      "https://dzmgxsm1og5yv.cloudfront.net/static/partner/p2m_qr_background_non_ploff.png",
    qrCode:
      "00020101021126550011vn.moca.www01368995a760-145d-4ddc-8dac-f7e6bb8097025204581253037045802VN5924Organic Store Green Food6011Ho Chi Minh62400507xXp8s9B07252592448d85036a29439dd833c64340002EN0124Organic Store Green Food6304DD73",
    qrFrameImage: "",
    qrProviderImage:
      "https://dzmgxsm1og5yv.cloudfront.net/static/partner/p2m_qr_provider_moca.png",
    qrType: "MOCA",
    qrTypeImage: "",
  },
  error: null,
};
