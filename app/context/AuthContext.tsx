// app/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

interface User {
  username: string;
  email: string;
  grabFoodToken: string;
  storeInfo: any;
  printers: any;
  shopeeFoodToken: string;
  notifications: any;
  jwt: string;
  // Thêm các trường khác nếu cần
}

interface AuthContextProps {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  printers: any;
  jwt: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      router.push("/screens/Auth/LoginScreen");
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
