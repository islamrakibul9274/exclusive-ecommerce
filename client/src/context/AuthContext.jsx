"use client";
import { createContext, useState, useEffect, useContext } from "react";
import axiosSecure from "../api/axiosSecure";
const Context = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    axiosSecure
      .get("/users/me")
      .then((res) => {
        if (alive) setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("ecommerce-token");
        localStorage.removeItem("ecommerce-user");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);
  function saveSession(data) {
    localStorage.removeItem("ecommerce-token");
    localStorage.removeItem("ecommerce-user");
    setUser(data.user);
  }
  async function logout() {
    try {
      await fetch("/api/users/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("ecommerce-token");
      localStorage.removeItem("ecommerce-user");
      setUser(null);
    }
  }
  return (
    <Context.Provider value={{ user, setUser, loading, saveSession, logout }}>
      {children}
    </Context.Provider>
  );
}
export const useAuth = () => useContext(Context);
