import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";

import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import Printer from "@/assets/images/printer.png";
//import { URL_DEVELOPMENT } from "@env";

import LottieView from "lottie-react-native";
import Modal from "react-native-modal";

import TcpSocket from "react-native-tcp-socket";
import Ping from "react-native-ping";

const API_BASE_URL = "https://foodlink-api.onrender.com";

const ScanPrinterScreen = () => {
  const { user } = useAuth();
  const [localIP, setLocalIP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false); // Biến trạng thái để quản lý việc hiển thị dòng chữ

  interface Printer {
    name: string;
    ip: string;
  }

  const [printers, setPrinters] = useState<Printer[]>([]);
  const godNames = [
    "Zeus",
    "Hera",
    "Poseidon",
    "Demeter",
    "Athena",
    "Apollo",
    "Artemis",
    "Ares",
    "Aphrodite",
    "Hephaestus",
    "Hermes",
    "Hestia",
    "Dionysus",
    "Hades",
    "Persephone",
  ];

  const handleOrderPress = (printer: Printer) => {
    router.push({
      pathname: "/screens/AddPrinterScreen",
      params: { printer: JSON.stringify(printer) },
    });
  };

  const checkPrinterPortWithTimeout = (
    ip: string,
    port: number,
    timeout: number
  ) => {
    return new Promise((resolve) => {
      const socket = TcpSocket.createConnection({ port, host: ip }, () => {
        socket.destroy();
        resolve(true); // Máy in đang mở cổng
      });

      const timer = setTimeout(() => {
        socket.destroy();
        resolve(false); // Timeout
      }, timeout);

      socket.on("error", () => {
        clearTimeout(timer);
        socket.destroy();
        resolve(false); // Không kết nối được
      });

      socket.on("timeout", () => {
        clearTimeout(timer);
        socket.destroy();
        resolve(false); // Timeout
      });

      socket.on("close", () => {
        clearTimeout(timer);
      });
    });
  };

  const checkPrinterPort = (ip, port) => {
    console.log("Checking printer port:", ip, port);
    return new Promise((resolve) => {
      const socket = TcpSocket.createConnection({ port, host: ip }, () => {
        socket.destroy();
        resolve(true); // Máy in đang mở cổng
      });

      socket.on("error", () => {
        socket.destroy();
        resolve(false); // Không kết nối được
      });

      socket.on("timeout", () => {
        socket.destroy();
        resolve(false); // Timeout
      });

      socket.on("close", () => {
        console.log(`Connection to ${ip}:${port} closed`);
      });
    });
  };

  const scanIP = async (
    ip: string,
    printerPorts: number[]
  ): Promise<Printer | undefined> => {
    try {
      const res = await Ping.start(ip, { timeout: 1000 });
      console.log(`IP ${ip} is alive:`, res);
      if (res && res !== 0) {
        const randomGodName =
          godNames[Math.floor(Math.random() * godNames.length)];
        return { ip, name: randomGodName };
      }
    } catch (error) {
      //console.error(`Error scanning IP ${ip}:`, error);
    }
    return undefined;
  };

  const MAX_CONCURRENT = 10; // Giới hạn số lượng kết nối đồng thời

  const scanPrinters = async () => {
    console.log("Scanning printers...");
    setPrinters([]);
    setIsLoading(true);
    setIsScanning(true); // Bắt đầu quét
    let printerFound = false; // Biến cờ để kiểm tra xem máy in đã được tìm thấy hay chưa

    const subnet = "192.168.1.";
    console.log("Scanning subnet:", subnet);

    const printerPorts = [9100, 515, 631, 139, 445];
    const promises = [];
    for (let i = 1; i < 255; i++) {
      const target = `${subnet}${i}`;
      console.log("Scanning target:", target);
      promises.push(
        scanIP(target, printerPorts).then((printer) => {
          if (printer) {
            console.log(`Printer found at: ${target}`);
            setPrinters((prevPrinters) => [...prevPrinters, printer]);
            if (!printerFound) {
              printerFound = true;
              setIsLoading(false); // Tắt modal khi tìm thấy máy in đầu tiên
            }
            return printer;
          }
        })
      );

      if (promises.length >= MAX_CONCURRENT) {
        await Promise.allSettled(promises);
        promises.length = 0; // Reset promises array
      }
    }

    Promise.allSettled(promises).then((results) => {
      const foundPrinters = results
        .filter((result) => result.status === "fulfilled" && result.value)
        .map((result) => (result as PromiseFulfilledResult<any>).value);
      setPrinters((prevPrinters) => [...prevPrinters, ...foundPrinters]);
      setIsScanning(false); // Kết thúc quét
      if (!printerFound) {
        setIsLoading(false); // Tắt modal nếu không tìm thấy máy in nào
      }
    });
  };

  const handleTestPrint = async (printer: any) => {
    console.log("Testing print on printer:", printer);
    try {
      const socket = TcpSocket.createConnection(
        { port: 9100, host: printer.ip },
        () => {
          const rawData = `In Test - ${printer.name}\n`; // Dữ liệu in đơn giản
          socket.write(rawData);
          socket.destroy();
          Alert.alert("In Test", `Đã in test trên máy in IP: ${printer.ip}`);
        }
      );

      socket.on("error", (error) => {
        console.error("Error printing:", error);
        Alert.alert("Lỗi", "Không thể in test trên máy in");
      });

      socket.on("timeout", () => {
        console.error("Timeout printing");
        Alert.alert("Lỗi", "Không thể in test trên máy in");
      });
    } catch (error) {
      console.error("Error printing:", error);
      Alert.alert("Lỗi", "Không thể in test trên máy in");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuItem} disabled>
        <Text style={styles.menuText}>Máy In đã lưu</Text>
      </TouchableOpacity>
      {user?.printers?.length > 0 &&
        user?.printers.map((printer: any, index: any) => (
          <TouchableOpacity
            style={styles.menuItem}
            key={index}
            //onPress={() => handleOrderPress(printer)}
          >
            <Image source={Printer} style={{ width: 30, height: 24 }} />
            <Text style={styles.menuText}>{printer.name}</Text>
            <Text
              style={{
                fontSize: 8,
                color: "green",
                paddingLeft: 10,
              }}
            >
              ●
            </Text>
          </TouchableOpacity>
        ))}
      <TouchableOpacity style={styles.menuItem} onPress={() => scanPrinters()}>
        <Text style={styles.menuText}>+ Thêm máy In</Text>
      </TouchableOpacity>
      {isLoading && (
        <Modal
          isVisible={isLoading}
          onBackdropPress={() => setIsLoading(false)}
          style={styles.modal}
          swipeDirection="down"
          onSwipeComplete={() => setIsLoading(false)}
        >
          <View style={styles.modalContent}>
            <LottieView
              source={require("../../assets/animations/loading.json")}
              autoPlay
              loop
              style={styles.loadingAnimation}
            />
            <Text style={styles.modalText}>
              Quá trình tìm kiếm có thể hơi lâu, bạn có thể chọn giải pháp nhận
              thủ công.
            </Text>
            <TouchableOpacity
              style={styles.manualButton}
              onPress={() => {
                setIsLoading(false);
                router.push({
                  pathname: "/screens/AddPrinterScreen",
                  params: { printer: JSON.stringify({}) },
                });
              }}
            >
              <Text style={styles.manualButtonText}>Nhập thủ công</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      {printers.map((printer, index) => (
        <TouchableOpacity
          style={styles.menuItem}
          key={index}
          onPress={() => handleOrderPress(printer)}
        >
          {/* <Image source={Printer} style={{ width: 400, height: 24 }} /> */}
          <Text style={styles.menuText}>{printer.name}</Text>
          <Text
            style={{
              fontSize: 8,
              color: "green",
              paddingLeft: 10,
            }}
          >
            ●
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: "green",
              paddingLeft: 10,
            }}
          >
            {printer.ip}
          </Text>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity
              style={styles.testPrintButton}
              onPress={() => handleTestPrint(printer)}
            >
              <Text style={styles.testPrintButtonText}>In Test</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
      {isScanning && !isLoading && (
        <Text style={styles.scanningText}>Vẫn đang tiếp tục quét...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  scanningText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 16,
    color: "gray",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF9900",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: { marginLeft: 10, fontSize: 16, color: "#333" },
  testPrintButton: {
    backgroundColor: "#FFA000",
    padding: 8,
    borderRadius: 5,
  },
  testPrintButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingAnimation: {
    width: 100,
    height: 100,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    alignItems: "center",
    height: "50%", // Chiều cao của modal là một nửa màn hình
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 16,
  },
  manualButton: {
    backgroundColor: "#FFA000", // Màu cam chủ đạo
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    position: "absolute",
    bottom: 20,
    width: "90%", // Chiều ngang của nút là 90% của modal
    alignItems: "center",
  },
  manualButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ScanPrinterScreen;
