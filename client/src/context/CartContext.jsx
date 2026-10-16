"use client";
import { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useCatalog } from "./CatalogContext";
import { productId } from "../lib/catalog";
import { calculateTotals } from "../lib/pricing";
const Context = createContext(null);
function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(fallback)
      ? Array.isArray(value)
        ? value
        : fallback
      : value || fallback;
  } catch {
    return fallback;
  }
}
export function CartProvider({ children }) {
  const [lines, setLines] = useState([]),
    [wishlist, setWishlist] = useState([]),
    [recent, setRecent] = useState([]),
    [coupon, setCoupon] = useState(""),
    [loaded, setLoaded] = useState(false);
  const {
    products,
    loading: catalogLoading,
    error: catalogError,
  } = useCatalog();
  // Browser storage is unavailable during the server render; hydrate it once after mounting.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setLines(
      read("ecommerce-cart", [])
        .filter((p) => /^[a-f\d]{24}$/i.test(productId(p)))
        .map((p) => ({
          ...p,
          quantity: Math.max(1, Math.min(10, Number(p.quantity) || 1)),
        })),
    );
    setWishlist(read("exclusive-wishlist", []));
    setRecent(read("exclusive-recent", []));
    setCoupon(
      localStorage.getItem("exclusive-coupon") === "WELCOME10"
        ? "WELCOME10"
        : "",
    );
    setLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("ecommerce-cart", JSON.stringify(lines));
      localStorage.setItem("exclusive-wishlist", JSON.stringify(wishlist));
      localStorage.setItem("exclusive-recent", JSON.stringify(recent));
      localStorage.setItem("exclusive-coupon", coupon);
    }
  }, [lines, wishlist, recent, coupon, loaded]);
  const latest = (p) => {
    const current = products.find((x) => productId(x) === productId(p));
    return current
      ? { ...p, ...current }
      : !catalogLoading && !catalogError
        ? { ...p, stock: 0 }
        : p;
  };
  const cart = lines.map((p) => ({ ...latest(p), quantity: p.quantity }));
  function addToCart(product, quantity = 1) {
    const id = productId(product),
      count = Math.max(1, Math.floor(Number(quantity) || 1)),
      current = lines.find((p) => productId(p) === id)?.quantity || 0;
    if (!/^[a-f\d]{24}$/i.test(id))
      return toast.error("This product is not available.");
    if (current + count > Math.min(10, product.stock ?? 10))
      return toast.error("You’ve reached the available quantity.");
    setLines((prev) =>
      prev.some((p) => productId(p) === id)
        ? prev.map((p) =>
            productId(p) === id ? { ...p, quantity: p.quantity + count } : p,
          )
        : [...prev, { ...product, quantity: count }],
    );
    toast.success("Added to your bag");
  }
  function updateQuantity(id, quantity) {
    const p = cart.find((p) => productId(p) === id);
    const n = Number(quantity);
    if (!Number.isInteger(n) || n < 1 || n > Math.min(10, p?.stock ?? 10))
      return toast.error("That quantity is not available.");
    setLines((prev) =>
      prev.map((p) => (productId(p) === id ? { ...p, quantity: n } : p)),
    );
  }
  function removeFromCart(id) {
    setLines((prev) => prev.filter((p) => productId(p) !== id));
  }
  function toggleWishlist(product) {
    const id = productId(product);
    setWishlist((prev) =>
      prev.some((p) => productId(p) === id)
        ? prev.filter((p) => productId(p) !== id)
        : [...prev, product],
    );
  }
  function applyCoupon(value) {
    if (!value.trim()) {
      toast.error("Enter an offer code first.");
      return false;
    }
    try {
      calculateTotals(0, value);
      setCoupon(value.trim().toUpperCase());
      toast.success("Offer applied");
      return true;
    } catch (e) {
      toast.error(e.message);
      return false;
    }
  }
  function viewProduct(id) {
    setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8));
  }
  const totals = calculateTotals(
    cart.reduce((sum, p) => sum + Math.round(p.price * 100) * p.quantity, 0),
    coupon,
  );
  return (
    <Context.Provider
      value={{
        cart,
        loaded,
        wishlist: wishlist.map(latest),
        recent,
        viewProduct,
        toggleWishlist,
        isWishlisted: (id) => wishlist.some((p) => productId(p) === id),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart: () => {
          setLines([]);
          setCoupon("");
        },
        totalItems: cart.reduce((s, p) => s + p.quantity, 0),
        coupon,
        applyCoupon,
        removeCoupon: () => setCoupon(""),
        totals,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useCart = () => useContext(Context);
