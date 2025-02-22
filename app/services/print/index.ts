import axios from "axios";
//import { URL_DEVELOPMENT } from "@env";

const API_BASE_URL = "http://52.77.222.212";

function removeVietnameseTones(str: any) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export const savePrinterToDB = async (
  name: string,
  ip: string,
  type: string,
  port: string,
  username: string
) => {
  console.log("Saving printer to DB:", name, ip, type, port, username);
  try {
    const response = await axios.post(`${API_BASE_URL}/save-printer`, {
      name,
      ip,
      type,
      port,
      username,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving printer:", error);
    throw error;
  }
};

export const updatePrinter = async (printerId, updatedInfo) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/update-printer/${printerId}`,
      updatedInfo
    );
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error("Error updating printer:", error);
    throw error;
  }
};

export const getHtmlContent = (order: any, printOption: any, platform: any) => {
  let title = "";
  let text = "";

  let option = "";

  if (platform === "grabfood") {
    if (!printOption) {
      printOption = "customer";
    } else option = printOption;

    if (option === "customer") {
      // Tiêu đề
      text += "GrabFood\n";
      text += `Order ID: ${order.displayID}\n`;

      // Thông tin đơn hàng
      text += "***** Sao chép (2) *****\n";
      text += `Lấy đơn lúc: ${new Date(
        order.times.acceptedAt
      ).toLocaleString()}\n`;
      text += "Đơn của ***\n";

      // Số món
      text += `------------------------------------------- ${order.itemInfo.count} món -----------------------------------------------------\n`;
      text += "✔ Cần dụng cụ ăn uốn\n";
      text +=
        "* Đối với những món đã hết, vui lòng xem ghi chú của khách hàng trên ứng dụng\n";
      // Danh sách món ăn
      text +=
        "------------------------------------------------------------------------------------------------------------\n";
      order.itemInfo.items.forEach((item) => {
        text += `${item.quantity} x ${item.name}                                            ${item.fare.priceDisplay}\n`;
        item.modifierGroups.forEach((group) => {
          group.modifiers.forEach((modifier) => {
            text += `  - ${modifier.modifierName}                                            ${modifier.priceDisplay}\n`;
          });
        });
      });

      // Tổng tiền
      text +=
        "------------------------------------------------------------------------------------------------------------\n";
      text += `Tổng (tạm tính):                                                            ${order.fare.totalDisplay}\n`;
      text += `Tổng cộng:                                                                  ${order.fare.totalDisplay}\n`;
      text += `------------------------------------------ ${order.displayID} ---------------------------------------------------\n`;
      // Thông tin thêm
      text += `${order.displayID}\n`;
      text += `${order.merchant.ID}\n`;
      text += `Đã đặt lúc: ${new Date(
        order.times.createdAt
      ).toLocaleString()}\n`;

      // Ghi chú
      text +=
        "Ghi chú cho ***: Vui lòng kiểm tra hóa đơn của đơn hàng trên ứng dụng để biết giá tiền chính xác.\n";
      //text += CUT_PAPER;
    }
    if (option === "restaurant") {
      // Tiêu đề
      text += "GrabFood\n";
      text += `Order ID: ${order.displayID}\n`;

      // // Thông tin đơn hàng
      text += `Lấy đơn lúc: ${new Date(
        order.times.acceptedAt
      ).toLocaleString()}\n`;
      text += "Đơn của: ***\n";
      text += "Khách hàng: ***\n";

      // Số món
      text += `------------------------------------------- ${order.itemInfo.count} món -----------------------------------------------------\n`;
      text += "- Cần dụng cụ ăn uống\n";
      text +=
        "- Đối với những món đã hết, vui lòng xem ghi chú của khách hàng trên ứng dụng\n";

      // Danh sách món ăn
      order.itemInfo.items.forEach((item) => {
        text += `${item.quantity} x ${item.name} (${
          item.comment || "Không có ghi chú"
        })\n`;
        item.modifierGroups.forEach((group) => {
          group.modifiers.forEach((modifier) => {
            text += `  - ${modifier.modifierName}\n`;
            text += `  Số lượng: ${modifier.modifierName}\n`;
          });
        });
      });

      // Tổng tiền
      text +=
        "------------------------------------------------------------------------------------------------------------\n";
      text += `Tổng (tạm tính):                                                            ${order.fare.totalDisplay}\n`;
      text += `Tổng cộng:                                                                  ${order.fare.totalDisplay}\n`;
      text += `------------------------------------------ ${order.displayID} ---------------------------------------------------\n`;

      // Thông tin thêm
      text += `Đã đặt lúc: ${new Date(
        order.times.createdAt
      ).toLocaleString()}\n`;
      text += "Được giao bởi: ***\n";
    }
    if (option === "kitchen") {
      // Tiêu đề
      text += "GRABFOOD\n";
      text += `------------------------------------------- ${order.itemInfo.count} món -----------------------------------------------------\n`;

      // Danh sách món ăn
      order.itemInfo.items.forEach((item) => {
        text += `${item.quantity} x ${item.name.toUpperCase()}\n`;
        if (item.comment) {
          text += `   🔹 Ghi chú: ${item.comment}\n`;
        }
        item.modifierGroups.forEach((group) => {
          group.modifiers.forEach((modifier) => {
            text += `   ➕ ${modifier.modifierName} (x${modifier.quantity})\n`;
          });
        });
        text +=
          "------------------------------------------------------------------------------------------------------------\n";
      });

      //text += CUT_PAPER;

      //text += "\nCHẾ BIẾN NGAY 🔥\n"; // Dòng nhắc chế biến
    }
  } else if (platform === "shopeefood") {
    if (!printOption) {
      printOption = "customer";
    } else option = printOption;

    if (option === "customer") {
      // Header
      text += "ShopeeFood\n";
      text +=
        "------------------------------------------------------------------------------------------\n";
      text += `${order.merchantName}\n`;
      text += `${order.merchantAddress}\n\n`;

      // Order Info
      text += `Mã đơn hàng: ${order.orderID}\n`;
      text += `Tài xế: ${order.driverName} (${order.driverID})\n`;
      text += `Thời gian lấy đơn: ${new Date(
        order.pickupTime
      ).toLocaleString()}\n`;
      text += `Thời gian in HD: ${new Date(
        order.printTime
      ).toLocaleString()}\n`;
      text += `Khách hàng: ${order.customerName}\n`;
      text += `Địa chỉ: ${order.customerAddress}\n\n`;

      // Divider
      text +=
        "------------------------------------------------------------------------------------------\n";

      // Items
      order.items.forEach((item, index) => {
        text += `${index + 1}. ${item.name} (${
          item.comment || "Không có ghi chú"
        }) x${item.quantity}\n`;
        text += `   ${item.price}d\n`;
      });

      // Divider
      text +=
        "------------------------------------------------------------------------------------------\n";

      // Totals
      text += `Tổng món: ${order.totalItems}\n`;
      text += `Tổng tiền món (giá gốc): ${order.totalOriginalPrice}d\n`;
      text += `Giảm giá món: ${order.totalDiscount}d\n`;
      text += `Tổng tiền: ${order.totalPrice}d\n`;
      text += `Chiết khấu: ${order.totalDiscount}d\n`;
      text += `Khuyến mãi khác: ${order.otherDiscount}d\n\n`;

      // Final Total
      text +=
        "------------------------------------------------------------------------------------------\n";
      text += `Tổng tiền: ${order.finalPrice}d\n`;
    }
    if (option === "kitchen") {
      // Header
      text += "ShopeeFood\n";
      text +=
        "------------------------------------------------------------------------------------------\n";
      text += `${order.merchantName}\n`;
      text += `${order.merchantAddress}\n\n`;

      // Order Info
      text += `Ma don hang: ${order.orderID}\n`;
      text += `Driver: ${removeVietnameseTones(order.driverName)} (${
        order.driverID
      })\n`;
      text += `Thoi gian lay hang: ${new Date(
        order.pickupTime
      ).toLocaleString()}\n`;
      text += `Thoi gian in HD: ${new Date(
        order.printTime
      ).toLocaleString()}\n`;
      text += `Khach hang: ${removeVietnameseTones(order.customerName)}\n`;
      text += `Dia chi: ${removeVietnameseTones(order.customerAddress)}\n\n`;

      // Divider
      text +=
        "------------------------------------------------------------------------------------------\n";

      // Items
      order.items.forEach((item, index) => {
        text += `${index + 1}. ${removeVietnameseTones(
          item.name
        )} (${removeVietnameseTones(item.comment || "Khong co ghi chu")}) x${
          item.quantity
        }\n`;
        text += `   ${item.price}d\n`;
        if (item.modifiers && item.modifiers.length > 0) {
          item.modifiers.forEach((modifier) => {
            text += `   - ${removeVietnameseTones(modifier.name)}: ${
              modifier.price
            }d\n`;
          });
        }
      });

      // Divider
      text +=
        "------------------------------------------------------------------------------------------\n";

      // Totals
      text += `Tong mon: ${order.totalItems}\n`;
      text += `Tong tien mon (gia goc): ${order.totalOriginalPrice}d\n`;
      text += `Giam gia mon: ${order.totalDiscount}d\n`;
      text += `Tong tien: ${order.totalPrice}d\n`;
      text += `Chiet khau: ${order.totalDiscount}d\n`;
      text += `Khuyen mai khac: ${order.otherDiscount}d\n\n`;

      // Final Total
      text +=
        "------------------------------------------------------------------------------------------\n";
      text += `Tong tien: ${order.finalPrice}d\n`;
    }
  }

  if (option === "") {
    text = ``;
  }

  return text;
};

export const getLabelHtmlContent = (item: any) => {
  console.log("Item:", item);
  let labelText = "";

  // Tiêu đề
  labelText +=
    "------------------------------------------------------------------------------------\n";

  // Thông tin món
  labelText += `🍽️ ${item.name.toUpperCase()}\n`;

  // Ghi chú (nếu có)
  if (item.comment) {
    labelText += `🔹 Ghi chú: ${item.comment}\n`;
  }

  // Tùy chọn món (modifiers)
  item.modifierGroups.forEach((group) => {
    group.modifiers.forEach((modifier) => {
      labelText += `➕ ${modifier.modifierName} (x${modifier.quantity})\n`;
    });
  });

  labelText +=
    "------------------------------------------------------------------------------------\n";

  return labelText;
};
