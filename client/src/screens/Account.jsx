"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FiUser,
  FiPackage,
  FiMapPin,
  FiLock,
  FiLogOut,
  FiShoppingBag,
  FiArrowUpRight,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCatalog } from "../context/CatalogContext";
import axiosSecure from "../api/axiosSecure";
import { money } from "../lib/catalog";
import { Breadcrumb, Button, Field, EmptyState } from "../components/UI";
export default function Account() {
  const { user, loading, setUser, logout } = useAuth(),
    router = useRouter(),
    params = useSearchParams(),
    { addToCart } = useCart(),
    { products } = useCatalog();
  const tab = params.get("tab") || "profile";
  const [busy, setBusy] = useState(false),
    [orders, setOrders] = useState([]),
    [ordersLoading, setOrdersLoading] = useState(false),
    [orderError, setOrderError] = useState("");
  function select(t) {
    router.replace(`/account${t === "profile" ? "" : `?tab=${t}`}`, {
      scroll: false,
    });
  }
  useEffect(() => {
    if (user && tab === "orders") {
      setOrdersLoading(true);
      axiosSecure
        .get("/orders?mine=true")
        .then((r) => {
          setOrders(r.data);
          setOrderError("");
        })
        .catch((e) =>
          setOrderError(
            e.response?.data?.message || "Orders could not be loaded.",
          ),
        )
        .finally(() => setOrdersLoading(false));
    }
  }, [user, tab]);
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const input =
        tab === "profile"
          ? { name: data.name }
          : tab === "address"
            ? { address: data }
            : {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
              };
      if (tab === "security" && data.newPassword !== data.confirmPassword)
        throw new Error("The new passwords do not match.");
      const res = await axiosSecure.patch("/users/me", input);
      setUser(res.data);
      toast.success("Your changes are saved");
      if (tab === "security") e.target.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  }
  async function cancel(id) {
    if (
      !window.confirm(
        "Cancel this order? Any reserved stock will be returned to the collection.",
      )
    )
      return;
    try {
      const res = await axiosSecure.patch(`/orders/${id}/status`, {
        status: "Cancelled",
      });
      setOrders((prev) => prev.map((o) => (o._id === id ? res.data.order : o)));
      toast.success("Order cancelled");
    } catch (e) {
      toast.error(e.response?.data?.message || "Unable to cancel this order.");
    }
  }
  if (loading) return <div className="page-loading">Opening your account…</div>;
  if (!user)
    return (
      <div className="container">
        <EmptyState
          icon={FiUser}
          title="Your own little corner of Exclusive."
          description="Sign in to manage your details, follow your orders, and keep your everyday in good company."
          href="/login?next=/account"
          action="Sign in to your account"
        />
      </div>
    );
  const tabs = [
    ["profile", FiUser, "Your profile"],
    ["orders", FiPackage, "Your orders"],
    ["address", FiMapPin, "Saved address"],
    ["security", FiLock, "Password"],
  ];
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: "Your account" }]} />
      <div className="page-heading">
        <div>
          <span className="eyebrow">MAKE YOURSELF AT HOME</span>
          <h1>
            Hello, <em>{user.name.split(" ")[0]}.</em>
          </h1>
          <p>Your finds, your details, your kind of everyday.</p>
        </div>
        <Link href="/shop" className="text-link">
          Find something good
          <FiArrowUpRight />
        </Link>
      </div>
      <div className="account-layout">
        <aside className="account-nav">
          <div className="account-avatar">{user.name.charAt(0)}</div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <nav>
            {tabs.map(([key, Icon, label]) => (
              <button
                className={tab === key ? "active" : ""}
                key={key}
                onClick={() => select(key)}
              >
                <Icon />
                {label}
              </button>
            ))}
            {user.role === "admin" && (
              <Link href="/admin">
                <FiShoppingBag />
                Store management
              </Link>
            )}
          </nav>
          <button
            className="logout"
            onClick={async () => {
              await logout();
              router.push("/");
            }}
          >
            <FiLogOut />
            Sign out
          </button>
        </aside>
        <div className="account-panel" key={tab}>
          <div className="panel-title">
            <div>
              <h2>{tabs.find((t) => t[0] === tab)?.[2] || "Your profile"}</h2>
              <p>
                {tab === "orders"
                  ? "Follow the journey of your good finds."
                  : tab === "address"
                    ? "A familiar address makes the next checkout easier."
                    : tab === "security"
                      ? "A fresh password, a little peace of mind."
                      : "A few details that make this place yours."}
              </p>
            </div>
          </div>
          {tab === "orders" ? (
            ordersLoading ? (
              <div className="page-loading">Finding your orders…</div>
            ) : orderError ? (
              <div className="notice error">{orderError}</div>
            ) : !orders.length ? (
              <EmptyState
                icon={FiPackage}
                title="Your story starts with a find."
                description="You haven’t placed an order yet. Your next favorite is out there."
              />
            ) : (
              <div>
                {orders.map((order) => (
                  <article className="order-card" key={order._id}>
                    <div className="order-card-top">
                      <div>
                        Order EX-{order._id.slice(-6).toUpperCase()}
                        <small>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </small>
                      </div>
                      <span
                        className={`status-pill ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="order-card-items">
                      {order.items.slice(0, 5).map((item, i) => (
                        <img
                          key={i}
                          src={
                            products.find((p) => p._id === item.productId)
                              ?.image || item.image
                          }
                          alt={item.name}
                          title={`${item.name} × ${item.quantity}`}
                        />
                      ))}
                    </div>
                    <div className="order-card-bottom">
                      <div>
                        <strong>{money(order.totalAmount)}</strong>
                        <Link
                          href={`/order/${order._id}`}
                          className="text-link"
                        >
                          View order
                          <FiArrowUpRight />
                        </Link>
                      </div>
                      <div>
                        {order.status === "Pending" &&
                          order.paymentStatus !== "paid" &&
                          order.paymentMethod !== "Credit Card" && (
                            <button
                              className="text-link"
                              onClick={() => cancel(order._id)}
                            >
                              Cancel order
                            </button>
                          )}
                        <button
                          className="button outline small"
                          onClick={() => {
                            let found = 0;
                            order.items.forEach((item) => {
                              const p = products.find(
                                (p) => p._id === item.productId,
                              );
                              if (p && p.stock > 0) {
                                addToCart(
                                  p,
                                  Math.min(item.quantity, p.stock, 10),
                                );
                                found++;
                              }
                            });
                            if (!found)
                              toast.error(
                                "These products are no longer available.",
                              );
                          }}
                        >
                          Buy again
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )
          ) : (
            <form onSubmit={save}>
              <div className="form-grid">
                {tab === "profile" ? (
                  <>
                    <div className="full">
                      <Field
                        label="Your name"
                        name="name"
                        defaultValue={user.name}
                        required
                        maxLength={100}
                      />
                    </div>
                    <div className="full">
                      <Field
                        label="Email address"
                        value={user.email}
                        readOnly
                      />
                      <p className="auth-footnote">
                        Your email is your account identifier.{" "}
                        <Link href="/contact?subject=Account%20email%20change">
                          Contact support
                        </Link>{" "}
                        for help changing it.
                      </p>
                    </div>
                  </>
                ) : tab === "address" ? (
                  <>
                    <div className="full">
                      <Field
                        label="Street address"
                        name="streetAddress"
                        defaultValue={user.address?.streetAddress}
                        required
                        maxLength={250}
                      />
                    </div>
                    <Field
                      label="City"
                      name="city"
                      defaultValue={user.address?.city}
                      required
                      maxLength={100}
                    />
                    <Field
                      label="Country"
                      name="country"
                      defaultValue={user.address?.country || "Bangladesh"}
                      required
                      maxLength={80}
                    />
                    <Field
                      label="Postal code"
                      name="postalCode"
                      defaultValue={user.address?.postalCode}
                      maxLength={20}
                    />
                    <Field
                      label="Phone number"
                      name="phone"
                      type="tel"
                      defaultValue={user.address?.phone}
                      required
                      minLength={6}
                      maxLength={30}
                    />
                  </>
                ) : (
                  <>
                    <div className="full">
                      <Field
                        label="Current password"
                        type="password"
                        name="currentPassword"
                        required
                        autoComplete="current-password"
                      />
                    </div>
                    <Field
                      label="New password"
                      type="password"
                      name="newPassword"
                      required
                      minLength={8}
                      maxLength={72}
                      autoComplete="new-password"
                    />
                    <Field
                      label="Confirm new password"
                      type="password"
                      name="confirmPassword"
                      required
                      minLength={8}
                      maxLength={72}
                      autoComplete="new-password"
                    />
                  </>
                )}
              </div>
              <Button disabled={busy}>
                {busy ? "Saving…" : "Save changes"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
