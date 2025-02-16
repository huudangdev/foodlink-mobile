import { Icon } from "@rneui/base";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
  Switch,
  View,
  Text,
  StyleSheet,
} from "react-native";

const SettingsScreen = () => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accountInfo, setAccountInfo] = useState({ name: "", email: "" });

  const toggleNotification = () => {
    setIsNotificationEnabled(!isNotificationEnabled);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const saveAccountInfo = () => {
    // Save account info logic here
    closeModal();
  };

  const handleEditInfoPress = () => {
    router.push("/screens/EditInfoScreen");
  };

  const handleChangePasswordPress = () => {
    router.push("/screens/ChangePasswordScreen");
  };

  const handleAppInfoPress = () => {
    router.push("/screens/AppInfoScreen");
  };

  const handleTermsAndConditionsPress = () => {
    router.push("/screens/Store/TermScreen");
  };

  const settings = [
    {
      id: 1,
      title: "Thông tin tài khoản",
      icon: "person-outline",
      hasArrow: true,
      onPress: handleEditInfoPress,
    },
    {
      id: 2,
      title: "Đổi mật khẩu",
      icon: "vpn-key",
      hasArrow: true,
      onPress: handleChangePasswordPress,
    },
    {
      id: 3,
      title: "Thông báo",
      icon: "notifications-none",
      hasSwitch: true,
    },
    {
      id: 4,
      title: "Thông tin ứng dụng",
      icon: "info-outline",
      hasInfo: true,
      onPress: handleAppInfoPress,
    },
    {
      id: 5,
      title: "Điều khoản & điều kiện",
      icon: "policy",
      hasInfo: true,
      onPress: handleTermsAndConditionsPress,
    },
  ];

  return (
    <View style={styles.container}>
      {settings.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.settingItem}
          activeOpacity={item.hasArrow || item.hasInfo ? 0.7 : 1}
          onPress={item.onPress}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Icon name={item.icon} size={24} color="#000" />
          </View>

          {/* Title */}
          <Text style={styles.title}>{item.title}</Text>

          {/* Right Side */}
          {item.hasArrow && (
            <Icon name="chevron-right" size={24} color="#ccc" />
          )}
          {item.hasSwitch && (
            <Switch
              trackColor={{ false: "#767577", true: "#ffc107" }}
              thumbColor={isNotificationEnabled ? "#fff" : "#f4f3f4"}
              onValueChange={toggleNotification}
              value={isNotificationEnabled}
            />
          )}
          {item.hasInfo && <Icon name="info-outline" size={24} color="#ccc" />}
        </TouchableOpacity>
      ))}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeModal}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Sửa thông tin tài khoản</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên"
              value={accountInfo.name}
              onChangeText={(text) =>
                setAccountInfo({ ...accountInfo, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={accountInfo.email}
              onChangeText={(text) =>
                setAccountInfo({ ...accountInfo, email: text })
              }
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={saveAccountInfo}>
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={closeModal}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    width: "100%",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  iconContainer: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: "100%",
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SettingsScreen;
