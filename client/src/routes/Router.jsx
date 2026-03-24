import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Wishlist from "../pages/Wishlist";
import Cart from "../pages/Cart";
import Account from "../pages/Account";
import NotFound from "../pages/NotFound";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import Contact from "../pages/Contact";
import About from "../pages/About";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRoute from "./AdminRoute";

import CheckOut from "../pages/CheckOut";

// 1. IMPORT STRIPE
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// 2. INITIALIZE STRIPE (Use your Publishable key from the Stripe Dashboard)
// Note: In production, this goes in a .env file, but we will hardcode it for testing!
const stripePromise = loadStripe('pk_test_51TEQ2gRqg3b6rhHt1Ci7tYEpQ6AbVXpKOgvC5yOxuByRJ6OCmkQiQ1Tgz7MavBPuWYR1IixW2GZVBZ33F8ESoe46003l0dxKNC');

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />
      },
      {
        path: "/wishlist",
        element: <Wishlist />
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/checkout",
        element: <CheckOut />
      },
      {
        path: "/account",
        element: <Account />
      },
      {
        path: "*", // This is the "catch-all" for broken URLs
        element: <NotFound />
      },
      { path: "/signup", element: <SignUp /> },
      { path: "/login", element: <Login /> },
      { path: "/contact", element: <Contact /> },
      { path: "/about", element: <About /> },
      // 3. WRAP THE CHECKOUT ROUTE
      {
        path: "/checkout",
        element: <CheckOut />
      }
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    )
  }
]);