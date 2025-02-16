import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { getGrabFoodOrders } from "../services/grabfood";
import { useOrders } from "../context/OrderContext";

const RevenueReportScreen = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const { orders, loading, error, totalRevenue } = useOrders();

  const router = useRouter();
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  //const [orders, setOrders] = useState([]);
  //const [error, setError] = useState<unknown>(null);
  const [dailyRevenue, setDailyRevenue] = useState<number[]>([]);
  //const [totalRevenue, setTotalRevenue] = useState(0);
  const [newCustomerRevenue, setNewCustomerRevenue] = useState(0);
  const [returningCustomerRevenue, setReturningCustomerRevenue] = useState(0);
  const [averageDailyRevenue, setAverageDailyRevenue] = useState(0);

  const handleConfirmStartDate = (date: any) => {
    setStartDate(date);
    setStartDatePickerVisibility(false);
  };

  const handleConfirmEndDate = (date: any) => {
    setEndDate(date);
    setEndDatePickerVisibility(false);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // const endTime = new Date().toISOString();
        // const startTime = new Date(
        //   new Date().setDate(new Date().getDate() - 29)
        // ).toISOString();
        // const pageIndex = 0;
        // const pageSize = 100;
        // const grabFoodToken = user?.grabFoodToken;

        // // Lấy danh sách order
        // const ordersData = await getGrabFoodOrders(
        //   startTime,
        //   endTime,
        //   pageIndex,
        //   pageSize,
        //   grabFoodToken,
        //   user?.username
        // );
        // setOrders(ordersData.statements);

        // Tính toán doanh thu hàng ngày
        const dailyRev = Array(30).fill(0);

        // Tính tổng doanh thu và doanh thu từ khách hàng mới và khách hàng quay lại
        let totalRev = 0;
        let newCustomerRev = 0;
        let returningCustomerRev = 0;

        orders.forEach((order: any) => {
          const price = parseFloat(order.priceDisplay);
          if (!isNaN(price)) {
            totalRev += price;
            if (order.isPaxNewCustomer) {
              newCustomerRev += price;
            } else {
              returningCustomerRev += price;
            }
          }
        });

        //setTotalRevenue(totalRev * 1000);
        setNewCustomerRevenue(newCustomerRev * 1000);
        setReturningCustomerRevenue(returningCustomerRev * 1000);
        setAverageDailyRevenue((totalRev * 1000) / 30);

        orders.forEach((order: any) => {
          //console.log("Order:", order);
          const orderDate = new Date(order.createdAt);
          const dayIndex = Math.floor(
            (today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (dayIndex < 30) {
            dailyRev[dayIndex] += parseFloat(order.priceDisplay) * 1000; // Tổng doanh thu hàng ngày
          }
        });

        setDailyRevenue(dailyRev.reverse());
      } catch (error) {
        //setError(error);
        console.error("Error fetching orders:", error);
      }
    };

    if (
      (user?.grabFoodToken && user?.grabFoodToken !== "") ||
      (user?.shopeeFoodToken && user?.shopeeFoodToken !== "")
    ) {
      fetchOrders();
    }
  }, [user]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.datePicker}>
        <TouchableOpacity onPress={() => setStartDatePickerVisibility(true)}>
          <Icon name="calendar" size={24} color="#000" style={{ padding: 8 }} />
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {startDate.toLocaleDateString("vi-VN")} -{" "}
          {endDate.toLocaleDateString("vi-VN")}
        </Text>
      </View>

      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmStartDate}
        onCancel={() => setStartDatePickerVisibility(false)}
        maximumDate={new Date()}
        minimumDate={new Date(new Date().setDate(new Date().getDate() - 30))}
      />

      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmEndDate}
        onCancel={() => setEndDatePickerVisibility(false)}
        maximumDate={new Date()}
        minimumDate={startDate}
      />

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
          <Text style={styles.summaryValue}>
            {dailyRevenue.reduce((a, b) => a + b, 0).toLocaleString("vi-VN")}{" "}
            VND
          </Text>
          <Text style={styles.summaryLabel}>Tổng doanh thu</Text>
        </View>
      </View>
      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          {
            label: "Doanh thu khách hàng mới",
            value: `${Math.round(newCustomerRevenue).toLocaleString(
              "vi-VN"
            )} VNĐ`,
            image: require("../../assets/images/order-background.jpg"),
          },
          {
            label: "Doanh thu khách hàng quay lại",
            value: `${Math.round(returningCustomerRevenue).toLocaleString(
              "vi-VN"
            )} VNĐ`,
            image: require("../../assets/images/revenue-background.png"),
          },
          {
            label: "Trung bình doanh thu theo ngày",
            value: `${Math.round(averageDailyRevenue).toLocaleString(
              "vi-VN"
            )} VNĐ`,
            image: require("../../assets/images/order-background.jpg"),
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

      {/* Bar Chart */}
      <View style={{ marginTop: 16, alignItems: "center" }}>
        <Text style={styles.chartTitle}>Biểu đồ doanh thu</Text>
        <Text style={{ fontSize: 14, fontWeight: "thin", marginTop: 8 }}>
          Đơn vị: VND
        </Text>
      </View>
      <BarChart
        data={{
          labels: Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toLocaleDateString("vi-VN", {
              month: "2-digit",
              day: "2-digit",
            });
          }),
          datasets: [
            {
              data: dailyRevenue.slice(-7),
              color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
            },
          ],
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
        fromZero
        showValuesOnTopOfBars
        formatYLabel={(yValue) => parseInt(yValue).toLocaleString("vi-VN")}
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
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  statImage: {
    width: "100%",
    height: 120,
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
    height: "95%",
    padding: 16,
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

export default RevenueReportScreen;
