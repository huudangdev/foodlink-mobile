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
  return (
    <View style={styles.container}>
      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Store Info */}
        <View style={styles.storeInfo}>
          <Image
            source={{ uri: "https://via.placeholder.com/80" }} // Replace with the store image URL
            style={styles.storeImage}
          />
          <Text style={styles.storeName}>GongCha 01-Nguyễn Văn Linh</Text>
          <Text style={styles.storeAddress}>01- Nguyễn Văn Linh</Text>
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
          <Text style={styles.sectionValue}>+84 901460814</Text>
          <Text style={styles.sectionValue}>nguyenhuyen184.nue@gmail.com</Text>
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
            49 Đường số 4, Khu Phố 4, Phường An Phú, Quận 2, Q.2, 7000
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
    alignItems: "center",
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
