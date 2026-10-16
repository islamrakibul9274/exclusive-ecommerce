"use client";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { CatalogProvider } from "./context/CatalogContext";
export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CatalogProvider>
        <CartProvider>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                borderRadius: "12px",
                background: "#171916",
                color: "#fff",
                fontSize: "14px",
              },
              duration: 3000,
            }}
          />
          {children}
        </CartProvider>
      </CatalogProvider>
    </AuthProvider>
  );
}
