"use client";
import { useState } from "react";
import { FiArrowRight, FiLock, FiX } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { money } from "../lib/catalog";
import { Button } from "./UI";
export default function OrderSummary({ checkout = false, quote, children }) {
  const { totals, coupon, applyCoupon, removeCoupon } = useCart();
  const t = quote || totals;
  const [code, setCode] = useState("");
  return (
    <aside className="order-summary">
      <span className="eyebrow">THE GOOD STUFF, TOGETHER</span>
      <h2>Your order summary</h2>
      <dl>
        <div>
          <dt>Subtotal</dt>
          <dd>{money(t.subtotal)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>
            {t.shippingAmount ? (
              money(t.shippingAmount)
            ) : (
              <span className="green">On us</span>
            )}
          </dd>
        </div>
        {t.discountAmount > 0 && (
          <div className="green">
            <dt>WELCOME10</dt>
            <dd>−{money(t.discountAmount)}</dd>
          </div>
        )}
        <div className="total-line">
          <dt>Total</dt>
          <dd>{money(t.totalAmount)}</dd>
        </div>
      </dl>
      {!checkout && (
        <>
          {coupon ? (
            <div className="applied-coupon">
              {coupon} applied
              <button aria-label="Remove offer code" onClick={removeCoupon}>
                <FiX />
              </button>
            </div>
          ) : (
            <form
              className="coupon-form"
              onSubmit={(e) => {
                e.preventDefault();
                applyCoupon(code);
              }}
            >
              <input
                aria-label="Offer code"
                required
                placeholder="Have an offer code?"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button aria-label="Apply code">
                <FiArrowRight />
              </button>
            </form>
          )}
          <Button href="/checkout">
            Continue to checkout
            <FiArrowRight />
          </Button>
        </>
      )}
      {children}
      <p className="summary-secure">
        <FiLock />A secure home for your checkout
      </p>
      <p className="summary-note">
        All prices in USD. Shipping is calculated before any offer discount.
      </p>
    </aside>
  );
}
