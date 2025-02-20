import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";

const useFetchOrders = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const endTime = new Date().toISOString();
        const startTime = new Date(
          new Date().setDate(new Date().getDate() - 29)
        ).toISOString();
        const pageIndex = 0;
        const pageSize = 100;
        const grabFoodToken = user?.grabFoodToken;

        // Fetch order history from the backend
        const response = await axios.get(
          "http://52.77.222.212/order-history",
          {
            params: {
              startTime,
              endTime,
              pageIndex,
              pageSize,
              grabFoodToken,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const ordersData = response.data.orders;

        // Cập nhật danh sách đơn hàng và tổng doanh thu
        setOrders(ordersData);
        const totalRev = ordersData.reduce(
          (acc: number, order: { priceDisplay: string }) => {
            const price = parseFloat(order.priceDisplay);
            return acc + (isNaN(price) ? 0 : price);
          },
          0
        );
        setTotalRevenue(totalRev * 1000);
      } catch (error) {
        setError(error as Error);
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.grabFoodToken) {
      fetchOrders();
      const intervalId = setInterval(fetchOrders, 25000); // Fetch every 25 seconds
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [user]);

  return { orders, loading, error, totalRevenue };
};

export default useFetchOrders;
