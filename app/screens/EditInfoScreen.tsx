import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const EditInfoScreen = () => {
  const [isEditing, setIsEditing] = useState([false, false, false]);
  const [values, setValues] = useState({
    name: "Hoàng Hà",
    phone: "09182748389",
    email: "Dxtech@gmail.com",
  });

  const handleEdit = (index: number) => {
    const newEditingState = [...isEditing];
    newEditingState[index] = !newEditingState[index];
    setIsEditing(newEditingState);
  };

  const handleChange = (key: string, value: string) => {
    setValues({ ...values, [key]: value });
  };

  const handleSave = (index: number) => {
    const newEditingState = [...isEditing];
    newEditingState[index] = false;
    setIsEditing(newEditingState);
  };

  return (
    <View style={styles.container}>
      {["Tên tài khoản", "Số điện thoại", "Email"].map((label, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                editable={isEditing[index]}
                value={
                  label === "Tên tài khoản"
                    ? values.name
                    : label === "Số điện thoại"
                    ? values.phone
                    : values.email
                }
                onChangeText={(text) =>
                  handleChange(
                    label === "Tên tài khoản"
                      ? "name"
                      : label === "Số điện thoại"
                      ? "phone"
                      : "email",
                    text
                  )
                }
              />
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  isEditing[index] ? handleSave(index) : handleEdit(index)
                }
              >
                <Text style={styles.editText}>
                  {isEditing[index] ? "Lưu" : "Chỉnh sửa"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          /* Add your onPress handler here */
        }}
      >
        <Text style={styles.buttonText}>Cập nhật</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    //justifyContent: "space-between",
  },
  row: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "bold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    height: 44,
  },
  editButton: {
    padding: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  editText: {
    color: "#f5a623",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#f5a623",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default EditInfoScreen;
