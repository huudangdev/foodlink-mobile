import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialIcons";
import DatePicker from "react-native-ui-datepicker";
import { useRouter } from "expo-router";

const CustomerReportScreen = () => {
  const router = useRouter();
  const [date, setDate] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}

      {/* Date Picker */}
      <View style={styles.datePicker}>
        {!showDatePicker ? (
          <View style={styles.datePicker}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Icon name="chevron-left" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.dateText}>Tháng 9 năm 2024</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Icon name="chevron-right" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        ) : (
          <DatePicker
            mode="single"
            date={date}
            //onDateChange={setDate}
            //onCloseModal={() => setShowDatePicker(false)}
          />
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["Tất cả", "ShopeeFood", "GrabFood"].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, index === 0 && styles.activeTab]}
          >
            <Text style={[styles.tabText, index === 0 && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <Image
          source={require("../../assets/images/revenue-background.png")}
          style={styles.summaryImage}
        />
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryValue}>1000 Người</Text>
          <Text style={styles.summaryLabel}>Số lượng khách hàng</Text>
          <Text style={styles.summaryChange}>+25%</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          {
            label: "Khách hàng mới",
            value: "500 người",
            image: require("../../assets/images/order-background.jpg"),
          },
          {
            label: "Khách hàng quay lại",
            value: "500 người",
            image: require("../../assets/images/revenue-background.png"),
          },
        ].map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Image source={stat.image} style={styles.statImage} />
            <View style={styles.textContainer}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Chart */}
      <View
        style={{
          marginTop: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.chartTitle}>Biểu đồ khách hàng</Text>
        <Text style={{ fontSize: 14, fontWeight: "thin", marginTop: 8 }}>
          Đơn vị: Người
        </Text>
      </View>
      <BarChart
        data={{
          labels: [
            "Thứ 2",
            "Thứ 3",
            "Thứ 4",
            "Thứ 5",
            "Thứ 6",
            "Thứ 7",
            "Chủ nhật",
          ],
          datasets: [{ data: [700, 850, 750, 600, 800, 1200, 1300] }],
        }}
        width={Dimensions.get("window").width - 32}
        height={240}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(255, 160, 0, ${opacity})`,
          barPercentage: 0.5,
          decimalPlaces: 0, // Ẩn các số 0 hiển thị sau dấu "."
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        style={styles.chart}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 24,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
    justifyContent: "flex-start",
  },
  tab: {
    padding: 12,
    alignItems: "center",
    borderRadius: 48,
    backgroundColor: "#f9f9f9",
    elevation: 2,
    marginHorizontal: 4,
    height: 40, // Thêm khoảng cách giữa các tabs
  },
  activeTab: {
    backgroundColor: "#ffc107",
  },
  tabText: {
    fontSize: 14,
    color: "#000",
  },
  activeTabText: {
    color: "#fff",
  },
  summaryCard: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  summaryImage: {
    width: "100%",
    height: 150,
  },
  summaryInfo: {
    padding: 16,
    color: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: to add a dark overlay
    borderRadius: 8,
    height: "100%",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    verticalAlign: "top",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#fff",
  },
  summaryChange: {
    fontSize: 14,
    color: "#4caf50",
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  statImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  textContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: to add a dark overlay
    borderRadius: 8,
    height: "100%",
    padding: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 14,
    color: "#fff",
  },
  chartContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    margin: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 0,
    marginTop: 0,
  },
  chartSubtitle: {
    fontSize: 14,
    color: "#000",
    marginBottom: 0,
  },
  chart: {
    marginVertical: 16,
    marginHorizontal: -16,
    elevation: 2,
  },
});

export default CustomerReportScreen;
