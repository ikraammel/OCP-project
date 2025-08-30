import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import axiosInstance from "./utils/axiosConfig"; 
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [cartItems, setCartItems] = useState([]);

  // Ref pour éviter double fetch
  const isFetchingCart = useRef(false);

  // 🔹 Charger le panier
  // 🔹 Charger le panier (uniquement pour employé)
const fetchCartItems = async (jwtToken) => {
  const activeToken = jwtToken || token;
  if (!activeToken || role !== "ROLE_EMPLOYE" || isFetchingCart.current) return;

  try {
    isFetchingCart.current = true;
    const res = await axiosInstance.get("/cart/me/items", {
      headers: { Authorization: `Bearer ${activeToken}` },
    });
    setCartItems(res.data);
  } catch (err) {
    console.error("Erreur fetchCartItems:", err);
  } finally {
    isFetchingCart.current = false;
  }
};

// 🔹 À l'initialisation si token existant et rôle employé
useEffect(() => {
  if (token && role === "ROLE_EMPLOYE" && cartItems.length === 0) {
    fetchCartItems();
  }
}, [token, role, cartItems.length]);


  // 🔹 Connexion
  const login = (tokenValue, userRole) => {
  setToken(tokenValue);
  setRole(userRole);
  localStorage.setItem("token", tokenValue);
  localStorage.setItem("role", userRole);

  // Si employé, fetch le panier immédiatement
  if(userRole === "ROLE_EMPLOYE") {
    fetchCartItems(tokenValue);
  }
};

  // 🔹 Déconnexion
  const logout = () => {
    setToken(null);
    setRole(null);
    setCartItems([]);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{ role, token, login, logout, cartItems, setCartItems }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
