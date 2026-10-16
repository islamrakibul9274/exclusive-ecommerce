"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FiLock, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { money, productId } from "../lib/catalog";
import axiosSecure from "../api/axiosSecure";
import { Breadcrumb, Button, EmptyState, Field } from "../components/UI";
import OrderSummary from "../components/OrderSummary";
const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publicKey ? loadStripe(publicKey) : null;
function CheckoutForm() {
  const { user, setUser } = useAuth(),
    { cart, coupon, clearCart } = useCart(),
    router = useRouter(),
    stripe = useStripe(),
    elements = useElements();
  const [quote, setQuote] = useState(null),
    [quoteError, setQuoteError] = useState(""),
    [quoting, setQuoting] = useState(true),
    [busy, setBusy] = useState(false),
    [method, setMethod] = useState("cod"),
    [error, setError] = useState("");
  const confirmed = useRef(null);
  const requestId = useRef(null);
  const items = cart.map((p) => ({
    productId: productId(p),
    quantity: p.quantity,
  }));
  const cartKey = JSON.stringify({ items, couponCode: coupon });
  useEffect(() => {
    let active = true;
    setQuoting(true);
    setQuoteError("");
    confirmed.current = null;
    requestId.current = null;
    const data = JSON.parse(cartKey);
    fetch("/api/cart/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.message);
        if (active) setQuote(d);
      })
      .catch((e) => {
        if (active) setQuoteError(e.message);
      })
      .finally(() => {
        if (active) setQuoting(false);
      });
    return () => {
      active = false;
    };
  }, [cartKey]);
  async function submit(e) {
    e.preventDefault();
    if (busy || quoting || !quote || quoteError) return;
    setBusy(true);
    setError("");
    const form = Object.fromEntries(new FormData(e.currentTarget));
    const billing = {
      firstName: form.firstName,
      streetAddress: form.streetAddress,
      city: form.city,
      phone: form.phone,
      email: form.email,
      country: form.country,
      postalCode: form.postalCode,
    };
    try {
      let paymentIntentId = confirmed.current;
      if (method === "card" && !paymentIntentId) {
        if (!stripe || !elements)
          throw new Error(
            "The card form is still loading. Please wait a moment.",
          );
        const intent = await axiosSecure.post(
          "/payments/create-payment-intent",
          { items, couponCode: coupon },
        );
        const result = await stripe.confirmCardPayment(
          intent.data.clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: { name: form.firstName, email: form.email },
            },
          },
        );
        if (result.error) throw new Error(result.error.message);
        if (result.paymentIntent?.status !== "succeeded")
          throw new Error(
            "Your payment is not complete yet. Please try again.",
          );
        paymentIntentId = result.paymentIntent.id;
        confirmed.current = paymentIntentId;
      }
      if (!requestId.current) requestId.current = crypto.randomUUID();
      const res = await axiosSecure.post("/orders", {
        checkoutRequestId: requestId.current,
        items,
        couponCode: coupon,
        billingDetails: billing,
        paymentMethod: method,
        paymentIntentId: method === "card" ? paymentIntentId : undefined,
      });
      if (form.saveAddress === "on") {
        try {
          const saved = await axiosSecure.patch("/users/me", {
            address: billing,
          });
          setUser(saved.data);
        } catch {
          /* The confirmed order is not blocked by an address preference. */
        }
      }
      clearCart();
      toast.success("Your order is confirmed");
      router.push(`/order/${res.data.order._id}`);
    } catch (err) {
      const message = confirmed.current
        ? "Your card payment succeeded, but the order could not be saved yet. Keep this page open and select “Complete order” to retry without another charge."
        : err.response?.data?.message ||
          err.message ||
          "Your order could not be completed.";
      setError(message);
      toast.error(message, { duration: 6000 });
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ALMOST YOURS</span>
          <h1>
            The finishing <em>touch.</em>
          </h1>
          <p>A few details, and your good finds are on their way.</p>
        </div>
        <span className="text-link">
          <FiLock />
          Secure checkout
        </span>
      </div>
      <form onSubmit={submit} className="checkout-layout">
        <div>
          <section className="checkout-form-section">
            <h2>
              <span>01</span>Where should it go?
            </h2>
            <div className="form-grid">
              <Field
                label="Full name"
                name="firstName"
                defaultValue={user.name}
                autoComplete="shipping name"
                required
                maxLength={100}
              />
              <Field
                label="Email address"
                name="email"
                type="email"
                defaultValue={user.email}
                autoComplete="email"
                required
              />
              <div className="full">
                <Field
                  label="Street address"
                  name="streetAddress"
                  defaultValue={user.address?.streetAddress}
                  autoComplete="shipping street-address"
                  required
                  maxLength={250}
                />
              </div>
              <Field
                label="City"
                name="city"
                defaultValue={user.address?.city}
                autoComplete="shipping address-level2"
                required
                maxLength={100}
              />
              <Field
                label="Phone number"
                name="phone"
                type="tel"
                defaultValue={user.address?.phone}
                autoComplete="tel"
                required
                minLength={6}
                maxLength={30}
              />
              <Field label="Country">
                <select
                  name="country"
                  defaultValue={user.address?.country || "Bangladesh"}
                  autoComplete="shipping country-name"
                >
                  {[
                    "Bangladesh",
                    "United States",
                    "United Kingdom",
                    "Canada",
                    "Australia",
                    "India",
                    "Germany",
                    "France",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field
                label="Postal code (optional)"
                name="postalCode"
                defaultValue={user.address?.postalCode}
                autoComplete="shipping postal-code"
                maxLength={20}
              />
            </div>
            <label className="check-field">
              <input type="checkbox" name="saveAddress" defaultChecked />
              Save this address to my account
            </label>
          </section>
          <section className="checkout-form-section">
            <h2>
              <span>02</span>How would you like to pay?
            </h2>
            <label
              className={`payment-option ${method === "cod" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={method === "cod"}
                onChange={() => {
                  if (!confirmed.current) setMethod("cod");
                }}
                disabled={!!confirmed.current}
              />
              <span>
                <strong>Cash on delivery</strong>
                <small>Pay when your order arrives. Simple as that.</small>
              </span>
            </label>
            <label
              className={`payment-option ${method === "card" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={method === "card"}
                onChange={() => setMethod("card")}
                disabled={!publicKey}
              />
              <span>
                <strong>Credit or debit card</strong>
                <small>Card details are handled securely by Stripe.</small>
              </span>
            </label>
            {method === "card" && (
              <>
                <div className="stripe-input">
                  <CardElement
                    options={{
                      hidePostalCode: true,
                      style: {
                        base: {
                          fontSize: "15px",
                          color: "#20231f",
                          "::placeholder": { color: "#8b9482" },
                        },
                      },
                    }}
                  />
                </div>
                {publicKey?.startsWith("pk_test") && (
                  <p className="auth-footnote">
                    Test mode: no real money is charged. Use card 4242 4242 4242
                    4242 with a future expiry and any 3-digit CVC.
                  </p>
                )}
              </>
            )}
          </section>
          <p className="auth-footnote">
            By placing this order, you agree to our{" "}
            <Link href="/policies">terms</Link> and{" "}
            <Link href="/help">delivery and returns policy</Link>. Your order
            will be saved in your account.
          </p>
          <div className="mobile-checkout-submit">
            <Button disabled={busy || quoting || !!quoteError}>
              {busy
                ? "Completing your order…"
                : confirmed.current
                  ? "Complete order"
                  : method === "card"
                    ? `Pay ${money(quote?.totalAmount)}`
                    : "Place order"}
              <FiArrowRight />
            </Button>
          </div>
        </div>
        <OrderSummary checkout quote={quote}>
          <div className="checkout-mini-items">
            {cart.map((p) => (
              <div key={productId(p)} className="checkout-mini-item">
                <img src={p.image} alt="" />
                <div>
                  {p.name}
                  <br />
                  <span>Quantity {p.quantity}</span>
                </div>
                <strong>{money(p.price * p.quantity)}</strong>
              </div>
            ))}
          </div>
          {quoteError && (
            <div className="notice error" role="alert">
              {quoteError} <Link href="/cart">Update your bag →</Link>
            </div>
          )}
          {error && (
            <div className="notice error" role="alert">
              {error}
            </div>
          )}
          <Button disabled={busy || quoting || !!quoteError}>
            {busy
              ? "Completing your order…"
              : quoting
                ? "Checking your bag…"
                : confirmed.current
                  ? "Complete order"
                  : method === "card"
                    ? `Pay ${money(quote?.totalAmount)}`
                    : "Place order"}
            <FiArrowRight />
          </Button>
        </OrderSummary>
      </form>
    </>
  );
}
export default function CheckOut() {
  const { user, loading } = useAuth(),
    { cart, loaded } = useCart();
  return (
    <div className="container page-space">
      <Breadcrumb
        items={[{ label: "Your bag", href: "/cart" }, { label: "Checkout" }]}
      />
      {loading || !loaded ? (
        <div className="page-loading">Getting things ready…</div>
      ) : !cart.length ? (
        <EmptyState
          icon={FiShoppingBag}
          title="A good checkout starts with a good find."
          description="Your bag is empty. Explore the collection to get started."
        />
      ) : !user ? (
        <EmptyState
          icon={FiLock}
          title="Make yourself at home first."
          description="Sign in to save your order and follow its journey. Your bag will be waiting right here."
          href="/login?next=/checkout"
          action="Sign in to checkout"
        />
      ) : (
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
