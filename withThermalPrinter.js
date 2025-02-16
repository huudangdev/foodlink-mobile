const { withAndroidManifest, withInfoPlist } = require("@expo/config-plugins");

const withThermalPrinter = (config) => {
  // Thêm các cấu hình cần thiết cho react-native-thermal-receipt-printer
  return config;
};

module.exports = withThermalPrinter;
