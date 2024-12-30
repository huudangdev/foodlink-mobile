// app/components/CustomHeader.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { Divider } from "@rneui/base";

interface CustomHeaderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPlatform: string;
  handlePlatformChange: (value: string) => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  open,
  setOpen,
  selectedPlatform,
  handlePlatformChange,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={selectedPlatform ? selectedPlatform : "ShopeeFood"}
          items={[
            {
              label: "ShopeeFood",
              icon: () => (
                <Image
                  source={require("@/assets/logo/shoppefood.png")}
                  style={{ width: 20, height: 20, marginRight: 0 }}
                />
              ),
              value: "ShopeeFood",
            },
            {
              label: "GrabFood",
              icon: () => (
                <Image
                  source={require("@/assets/logo/grabfood.png")}
                  style={{ width: 20, height: 20 }}
                />
              ),
            },
          ]}
          setOpen={setOpen}
          setValue={(callback) => {
            const value =
              typeof callback === "function"
                ? callback(selectedPlatform)
                : callback;
            handlePlatformChange(value);
          }}
          containerStyle={{
            height: 40,
            width: 180,
          }}
          dropDownContainerStyle={{
            borderWidth: 0,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "center",
    backgroundColor: "white",
    alignItems: "center",
    marginTop: 60,
    height: 72,
    width: "100%",
  },
  dropdownContainer: {
    marginTop: 10,
  },
});

export default CustomHeader;
