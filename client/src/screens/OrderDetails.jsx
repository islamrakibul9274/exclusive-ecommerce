"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FiCheck, FiPackage, FiCopy, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";
import axiosSecure from "../api/axiosSecure";
import { money } from "../lib/catalog";
import { useCatalog } from "../context/CatalogContext";
import { Breadcrumb, Button, EmptyState } from "../components/UI";
export default function OrderDetails() {
  const { id } = useParams(),
    { products } = useCatalog();
  const [order, setOrder] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    axiosSecure
      .get(`/orders/detail/${id}`)
      .then((r) => setOrder(r.data))
      .catch((e) =>
        setError(
          e.response?.data?.message || "Please sign in to view this order.",
        ),
      );
  }, [id]);
  if (error)
    return (
      <div className="container">
        <EmptyState
          icon={FiPackage}
          title="We couldn’t open this order."
          description={error}
          href="/account?tab=orders"
          action="Go to your orders"
        />
      </div>
    );
  if (!order) return <div className="page-loading">Opening your order…</div>;
  return (
    <div className="success-page">
      <Breadcrumb
        items={[
          { label: "Your account", href: "/account" },
          { label: "Your order" },
        ]}
      />
      <div className="success-hero">
        <span className="success-check">
          {order.status === "Cancelled" ? <FiPackage /> : <FiCheck />}
        </span>
        <span className="eyebrow">A VERY GOOD CHOICE</span>
        <h1>
          {order.status === "Cancelled" ? (
            <>
              A change of <em>plans.</em>
            </>
          ) : order.status === "Delivered" ? (
            <>
              Good things, <em>delivered.</em>
            </>
          ) : (
            <>
              Good things are <em>coming.</em>
            </>
          )}
        </h1>
        <p>
          Your order is saved. You can follow its progress right here or from
          your account.
        </p>
      </div>
      <div className="order-receipt">
        <div className="receipt-top">
          <div>
            <small>YOUR ORDER</small>
            <strong>EX-{id.slice(-6).toUpperCase()}</strong>
            <button
              className="icon-button"
              aria-label="Copy full order reference"
              onClick={async () => {
                await navigator.clipboard.writeText(id);
                toast.success("Order reference copied");
              }}
            >
              <FiCopy />
            </button>
          </div>
          <span className={`status-pill ${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </div>
        {order.items.map((p, i) => (
          <div className="checkout-mini-item" key={i}>
            <img
              src={
                products.find((x) => x._id === p.productId)?.image || p.image
              }
              alt={p.name}
            />
            <div>
              {p.name}
              <br />
              <span>Quantity {p.quantity}</span>
            </div>
            <strong>{money(p.price * p.quantity)}</strong>
          </div>
        ))}
        <div className="receipt-grid">
          <div>
            <h3>Going to</h3>
            <p>
              {order.billingDetails.firstName}
              <br />
              {order.billingDetails.streetAddress}
              <br />
              {order.billingDetails.city}
              {order.billingDetails.postalCode
                ? `, ${order.billingDetails.postalCode}`
                : ""}
              <br />
              {order.billingDetails.country}
              <br />
              {order.billingDetails.phone}
            </p>
          </div>
          <div>
            <h3>The details</h3>
            <p>
              {order.paymentMethod}
              <br />
              Payment:{" "}
              {order.paymentStatus === "paid" ||
              order.paymentMethod === "Credit Card"
                ? "Paid"
                : "Due on delivery"}
              <br />
              Shipping:{" "}
              {order.shippingAmount ? money(order.shippingAmount) : "Free"}
              {order.discountAmount > 0 && (
                <>
                  <br />
                  Offer saving: {money(order.discountAmount)}
                </>
              )}
              <br />
              Ordered {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="receipt-total">
          <span>Total</span>
          <strong>{money(order.totalAmount)}</strong>
        </div>
      </div>
      <div className="form-actions">
        <Button href="/shop">
          Keep exploring
          <FiArrowRight />
        </Button>
        <Button variant="outline" href="/account?tab=orders">
          All your orders
        </Button>
      </div>
    </div>
  );
}
