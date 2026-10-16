"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiMessageSquare,
  FiPlus,
  FiEdit2,
  FiArchive,
  FiRefreshCw,
  FiArrowUpRight,
  FiLogOut,
  FiUpload,
  FiCheck,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCatalog } from "../context/CatalogContext";
import axiosSecure from "../api/axiosSecure";
import { money } from "../lib/catalog";
import { Button, Modal, Field } from "../components/UI";
export default function AdminDashboard() {
  const { user, logout } = useAuth(),
    { refresh: refreshCatalog } = useCatalog(),
    router = useRouter();
  const [tab, setTab] = useState("overview"),
    [products, setProducts] = useState([]),
    [orders, setOrders] = useState([]),
    [messages, setMessages] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [query, setQuery] = useState(""),
    [showArchived, setShowArchived] = useState(false),
    [editing, setEditing] = useState(null),
    [saving, setSaving] = useState(false),
    [uploading, setUploading] = useState(false);
  const close = useCallback(() => {
    if (!saving) setEditing(null);
  }, [saving]);
  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [p, o, m] = await Promise.all([
        axiosSecure.get("/products?all=true"),
        axiosSecure.get("/orders"),
        axiosSecure.get("/contact"),
      ]);
      setProducts(p.data);
      setOrders(o.data);
      setMessages(m.data);
    } catch (e) {
      setError(e.response?.data?.message || "Store data could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  async function archive(product) {
    const active = product.active === false;
    if (
      !active &&
      !window.confirm(
        `Archive ${product.name}? It will be hidden from the collection and can be restored here.`,
      )
    )
      return;
    try {
      const res = await axiosSecure.patch(`/products/${product._id}`, {
        active,
      });
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? res.data : p)),
      );
      refreshCatalog();
      toast.success(active ? "Product restored" : "Product archived");
    } catch (e) {
      toast.error(e.response?.data?.message || "Unable to update product.");
    }
  }
  async function saveProduct(e) {
    e.preventDefault();
    setSaving(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      let image = data.image;
      const file = data.imageFile;
      if (file?.size) {
        if (file.size > 3 * 1024 * 1024)
          throw new Error("Please choose an image of 3 MB or less.");
        setUploading(true);
        const body = new FormData();
        body.set("image", file);
        const uploaded = await axiosSecure.post("/uploads/image", body);
        image = uploaded.data.url;
        setUploading(false);
      }
      if (!image) throw new Error("Upload an image or add an image URL.");
      const input = {
        name: data.name,
        price: data.price,
        oldPrice: data.oldPrice,
        image,
        category: data.category,
        stock: data.stock,
        description: data.description,
      };
      if (editing._id) {
        await axiosSecure.patch(`/products/${editing._id}`, input);
      } else {
        await axiosSecure.post("/products", input);
      }
      toast.success(editing._id ? "Product saved" : "Product added");
      setEditing(null);
      await refresh();
      refreshCatalog();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }
  async function status(id, value) {
    if (
      value === "Cancelled" &&
      !window.confirm("Cancel this order and restore its reserved stock?")
    )
      return;
    try {
      const res = await axiosSecure.patch(`/orders/${id}/status`, {
        status: value,
      });
      setOrders((prev) => prev.map((o) => (o._id === id ? res.data.order : o)));
      toast.success("Order status updated");
      refreshCatalog();
    } catch (e) {
      toast.error(e.response?.data?.message || "Order could not be updated.");
    }
  }
  async function markRead(message) {
    try {
      const res = await axiosSecure.patch(`/contact/${message._id}`);
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? res.data : m)),
      );
    } catch (e) {
      toast.error(e.response?.data?.message || "Unable to update message.");
    }
  }
  const tabs = [
    ["overview", FiGrid, "Overview"],
    ["inventory", FiPackage, "Inventory"],
    ["orders", FiShoppingBag, "Orders"],
    ["messages", FiMessageSquare, "Support inbox"],
  ];
  const activeProducts = products.filter((p) => p.active !== false),
    pending = orders.filter((o) => o.status === "Pending"),
    unread = messages.filter((m) => !m.read),
    low = activeProducts.filter((p) => p.stock < 5);
  const filteredProducts = products.filter(
    (p) =>
      (showArchived || p.active !== false) &&
      `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  const filteredOrders = orders.filter((o) =>
    `${o._id} ${o.billingDetails?.firstName} ${o.billingDetails?.email} ${o.status}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <Link href="/" className="logo">
          exclusive<span>✳</span>
        </Link>
        <div>
          <span>Store management</span>
          <Link className="text-link" href="/">
            View storefront
            <FiArrowUpRight />
          </Link>
          <button
            className="icon-button"
            aria-label="Sign out"
            onClick={async () => {
              await logout();
              router.push("/");
            }}
          >
            <FiLogOut />
          </button>
        </div>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          {tabs.map(([key, Icon, label]) => (
            <button
              key={key}
              className={tab === key ? "active" : ""}
              onClick={() => {
                setTab(key);
                setQuery("");
              }}
            >
              <Icon />
              {label}
              {key === "messages" && unread.length > 0 && (
                <span>({unread.length})</span>
              )}
            </button>
          ))}
          <p>
            Signed in as
            <br />
            <strong>{user?.name}</strong>
          </p>
        </aside>
        <div className="admin-content">
          <span className="eyebrow">THE STORE, AT A GLANCE</span>
          <h1>
            {tab === "overview"
              ? "Good things, in motion."
              : tab === "inventory"
                ? "Your collection."
                : tab === "orders"
                  ? "Every order, in view."
                  : "Let’s help someone."}
          </h1>
          <p className="muted">
            {tab === "overview"
              ? "The latest from your collection, orders, and support inbox."
              : tab === "inventory"
                ? "Add, edit, and archive products. Changes appear in the storefront."
                : tab === "orders"
                  ? "Move orders from pending to shipped and delivered."
                  : "Customer messages saved through the contact form."}
          </p>
          {error && (
            <div className="notice error" style={{ marginTop: 20 }}>
              {error}
              <button className="text-link" onClick={refresh}>
                Try again
                <FiRefreshCw />
              </button>
            </div>
          )}
          {loading ? (
            <div className="page-loading">Loading store data…</div>
          ) : (
            <>
              {tab === "overview" ? (
                <>
                  <div className="admin-stats">
                    {[
                      [
                        "Order value",
                        money(
                          orders
                            .filter((o) => o.status !== "Cancelled")
                            .reduce((sum, o) => sum + o.totalAmount, 0),
                        ),
                        "Includes paid and cash-on-delivery orders",
                      ],
                      [
                        "Active products",
                        activeProducts.length,
                        `${low.length} low-stock items`,
                      ],
                      [
                        "Pending orders",
                        pending.length,
                        "Ready for your next step",
                      ],
                      [
                        "Unread messages",
                        unread.length,
                        "A conversation waiting to happen",
                      ],
                    ].map(([label, value, note]) => (
                      <div className="admin-stat" key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                        <small>{note}</small>
                      </div>
                    ))}
                  </div>
                  <div className="overview-grid">
                    <section className="overview-card">
                      <h2>Recent orders</h2>
                      {orders.slice(0, 5).map((o) => (
                        <div className="overview-line" key={o._id}>
                          <div>
                            EX-{o._id.slice(-6).toUpperCase()}
                            <small>{o.billingDetails?.firstName}</small>
                          </div>
                          <strong>{money(o.totalAmount)}</strong>
                          <span
                            className={`status-pill ${o.status.toLowerCase()}`}
                          >
                            {o.status}
                          </span>
                        </div>
                      ))}
                      {!orders.length && (
                        <p className="admin-note">No orders yet.</p>
                      )}
                      <button
                        className="text-link"
                        onClick={() => setTab("orders")}
                        style={{ marginTop: 20 }}
                      >
                        All orders
                        <FiArrowUpRight />
                      </button>
                    </section>
                    <section className="overview-card">
                      <h2>Keep an eye on stock</h2>
                      {low.map((p) => (
                        <div className="overview-line" key={p._id}>
                          <div>
                            {p.name}
                            <small>{p.category}</small>
                          </div>
                          <strong>{p.stock} left</strong>
                          <button
                            className="icon-button"
                            aria-label={`Edit ${p.name}`}
                            onClick={() => setEditing(p)}
                          >
                            <FiEdit2 />
                          </button>
                        </div>
                      ))}
                      {!low.length && (
                        <p className="admin-note">
                          Everything in the active collection has at least five
                          units in stock.
                        </p>
                      )}
                      <button
                        className="text-link"
                        onClick={() => setTab("inventory")}
                        style={{ marginTop: 20 }}
                      >
                        Manage inventory
                        <FiArrowUpRight />
                      </button>
                    </section>
                  </div>
                </>
              ) : tab === "inventory" ? (
                <>
                  <div className="admin-toolbar">
                    <input
                      aria-label="Search inventory"
                      placeholder="Search by name or category…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <label className="check-field">
                      <input
                        type="checkbox"
                        checked={showArchived}
                        onChange={(e) => setShowArchived(e.target.checked)}
                      />
                      Include archived
                    </label>
                    <Button onClick={() => setEditing({})}>
                      <FiPlus />
                      Add a product
                    </Button>
                  </div>
                  <div className="data-table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((p) => (
                          <tr key={p._id}>
                            <td>
                              <div>
                                <img src={p.image} alt="" />
                                <span className="admin-table-title">
                                  {p.name}
                                  <small>
                                    EX-{p._id.slice(-6).toUpperCase()}
                                  </small>
                                </span>
                              </div>
                            </td>
                            <td>{p.category}</td>
                            <td>{money(p.price)}</td>
                            <td>{p.stock}</td>
                            <td>
                              <span
                                className={`status-pill ${p.active === false ? "cancelled" : ""}`}
                              >
                                {p.active === false ? "Archived" : "Active"}
                              </span>
                            </td>
                            <td>
                              <div className="admin-table-action">
                                <button
                                  className="icon-button"
                                  aria-label={`Edit ${p.name}`}
                                  onClick={() => setEditing(p)}
                                >
                                  <FiEdit2 />
                                </button>
                                <button
                                  className="icon-button"
                                  aria-label={`${p.active === false ? "Restore" : "Archive"} ${p.name}`}
                                  onClick={() => archive(p)}
                                >
                                  {p.active === false ? (
                                    <FiRefreshCw />
                                  ) : (
                                    <FiArchive />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {!filteredProducts.length && (
                          <tr>
                            <td colSpan="6" className="table-empty">
                              No products match this view.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <p className="admin-note">
                    Archiving hides a product from the collection. Existing
                    order records stay intact, and products can be restored.
                  </p>
                </>
              ) : tab === "orders" ? (
                <>
                  <div className="admin-toolbar">
                    <input
                      aria-label="Search orders"
                      placeholder="Search order reference, customer, or status…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button variant="outline" onClick={refresh}>
                      <FiRefreshCw />
                      Refresh
                    </Button>
                  </div>
                  <div className="data-table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Reference</th>
                          <th>Customer</th>
                          <th>Placed</th>
                          <th>Total</th>
                          <th>Payment</th>
                          <th>Status</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((o) => (
                          <tr key={o._id}>
                            <td>EX-{o._id.slice(-6).toUpperCase()}</td>
                            <td>
                              {o.billingDetails?.firstName}
                              <small>{o.billingDetails?.email}</small>
                            </td>
                            <td>
                              {new Date(o.createdAt).toLocaleDateString()}
                            </td>
                            <td>{money(o.totalAmount)}</td>
                            <td>
                              {o.paymentMethod}
                              <small>
                                {o.paymentStatus === "paid" ||
                                o.paymentMethod === "Credit Card"
                                  ? "Paid"
                                  : "Due on delivery"}
                              </small>
                            </td>
                            <td>
                              <select
                                aria-label={`Status of order ${o._id}`}
                                value={o.status}
                                onChange={(e) => status(o._id, e.target.value)}
                              >
                                <option value={o.status}>{o.status}</option>
                                {["Pending", "Paid"].includes(o.status) && (
                                  <option>Shipped</option>
                                )}
                                {o.status === "Shipped" && (
                                  <option>Delivered</option>
                                )}
                                {o.status === "Pending" &&
                                  o.paymentStatus !== "paid" &&
                                  o.paymentMethod !== "Credit Card" && (
                                    <option>Cancelled</option>
                                  )}
                              </select>
                            </td>
                            <td>
                              <Link
                                className="icon-button"
                                aria-label={`View order ${o._id}`}
                                href={`/order/${o._id}`}
                              >
                                <FiArrowUpRight />
                              </Link>
                            </td>
                          </tr>
                        ))}
                        {!filteredOrders.length && (
                          <tr>
                            <td colSpan="7" className="table-empty">
                              No orders match this view.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <p className="admin-note">
                    Cancelling an eligible cash order returns its items to
                    stock. Paid orders need a refund arranged separately before
                    cancellation.
                  </p>
                </>
              ) : (
                <>
                  <div className="admin-toolbar">
                    <span className="muted">
                      {messages.length} messages · {unread.length} unread
                    </span>
                    <Button variant="outline" onClick={refresh}>
                      <FiRefreshCw />
                      Refresh
                    </Button>
                  </div>
                  <div className="support-list">
                    {messages.map((m) => (
                      <article
                        className={`support-message ${!m.read ? "unread" : ""}`}
                        key={m._id}
                      >
                        <div>
                          <h3>{m.subject}</h3>
                          <small>
                            {new Date(m.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <small>
                          {m.name} · {m.email}
                        </small>
                        <p>{m.message}</p>
                        <div>
                          <a
                            className="text-link"
                            href={`mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent("Re: " + m.subject)}`}
                          >
                            Reply in your email app
                            <FiArrowUpRight />
                          </a>
                          {!m.read && (
                            <button
                              className="text-link"
                              onClick={() => markRead(m)}
                            >
                              <FiCheck />
                              Mark read
                            </button>
                          )}
                        </div>
                      </article>
                    ))}
                    {!messages.length && (
                      <div className="notice">
                        The support inbox is clear. Customer messages will
                        appear here.
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
          {editing && (
            <Modal
              title={editing._id ? "Edit your find" : "Add a good find"}
              onClose={close}
              wide
            >
              <form onSubmit={saveProduct}>
                <div className="form-grid">
                  <div className="full">
                    <Field
                      label="Product name"
                      name="name"
                      defaultValue={editing.name}
                      required
                      maxLength={150}
                    />
                  </div>
                  <Field
                    label="Price (USD)"
                    name="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={editing.price}
                    required
                  />
                  <Field
                    label="Compare-at price (optional)"
                    name="oldPrice"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={editing.oldPrice || ""}
                  />
                  <Field label="Category">
                    <select
                      name="category"
                      defaultValue={editing.category || "Gaming"}
                    >
                      {[
                        "Gaming",
                        "Computers",
                        "Electronics",
                        "Men's Fashion",
                        "Woman's Fashion",
                        "Home & Lifestyle",
                      ].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label="Stock quantity"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={editing.stock ?? 10}
                    required
                  />
                  <div className="full">
                    <Field label="Description">
                      <textarea
                        name="description"
                        defaultValue={editing.description}
                        rows={4}
                        maxLength={3000}
                      />
                    </Field>
                  </div>
                  <div className="full">
                    <Field
                      label="Image URL (or upload a file below)"
                      name="image"
                      defaultValue={
                        editing.originalImage || editing.image || ""
                      }
                      placeholder="https://… or /images/…"
                      maxLength={2048}
                    />
                  </div>
                  <div className="full">
                    <Field
                      label="Upload a new image · max 3 MB"
                      name="imageFile"
                      type="file"
                      accept="image/*"
                    />
                  </div>
                </div>
                {editing.image && (
                  <div className="admin-image-preview">
                    <img src={editing.image} alt="Current product" />
                  </div>
                )}
                <div className="form-actions">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={close}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button disabled={saving}>
                    <FiUpload />
                    {uploading
                      ? "Uploading image…"
                      : saving
                        ? "Saving…"
                        : "Save product"}
                  </Button>
                </div>
              </form>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}
