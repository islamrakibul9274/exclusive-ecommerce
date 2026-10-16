"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
const Context = createContext(null);
export function CatalogProvider({ children }) {
  const [products, setProducts] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProducts(data);
    } catch (e) {
      setError(e.message || "The collection could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return (
    <Context.Provider value={{ products, loading, error, refresh }}>
      {children}
    </Context.Provider>
  );
}
export const useCatalog = () => useContext(Context);
