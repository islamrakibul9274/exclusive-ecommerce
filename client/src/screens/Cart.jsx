"use client";
import Link from "next/link";
import {
  FiShoppingBag,
  FiTrash2,
  FiHeart,
  FiArrowRight,
  FiTruck,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { money, productId } from "../lib/catalog";
import { Breadcrumb, EmptyState, Quantity, LoadState } from "../components/UI";
import OrderSummary from "../components/OrderSummary";
export default function Cart() {
  const {
    cart,
    loaded,
    updateQuantity,
    removeFromCart,
    toggleWishlist,
    isWishlisted,
    totalItems,
    totals,
  } = useCart();
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: "Your bag" }]} />
      <div className="page-heading">
        <div>
          <span className="eyebrow">GOOD CHOICES, ALL TOGETHER</span>
          <h1>
            Your shopping <em>bag.</em>
          </h1>
          <p>
            {totalItems} {totalItems === 1 ? "good thing" : "good things"},
            ready for their next chapter.
          </p>
        </div>
        <Link className="text-link" href="/shop">
          Keep exploring
          <FiArrowRight />
        </Link>
      </div>
      {!loaded ? (
        <LoadState />
      ) : !cart.length ? (
        <EmptyState
          icon={FiShoppingBag}
          title="Your bag is full of possibility."
          description="Give your everyday an upgrade. Your next favorite is waiting in the collection."
        />
      ) : (
        <div className="cart-layout">
          <div>
            <div className="shipping-progress">
              <span>
                <FiTruck />
                {totals.subtotal >= 150 ? (
                  "Your shipping is on us. Nice find."
                ) : (
                  <>
                    You’re <strong>{money(150 - totals.subtotal)}</strong> away
                    from free shipping.
                  </>
                )}
              </span>
              <div>
                <i
                  style={{
                    width: `${Math.min(100, (totals.subtotal / 150) * 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="bag-list">
              {cart.map((p) => (
                <article className="bag-item" key={productId(p)}>
                  <Link href={`/product/${productId(p)}`} className="bag-photo">
                    <img src={p.image} alt={p.name} />
                  </Link>
                  <div className="bag-info">
                    <span className="product-category">
                      {p.group || p.category}
                    </span>
                    <Link href={`/product/${productId(p)}`}>
                      <h3>{p.name}</h3>
                    </Link>
                    <p className="muted">
                      {money(p.price)} each
                      {p.stock < p.quantity && (
                        <span className="field-error">
                          {" "}
                          · Only {p.stock} available
                        </span>
                      )}
                    </p>
                    <div className="bag-controls">
                      <Quantity
                        value={p.quantity}
                        onChange={(n) => updateQuantity(productId(p), n)}
                        max={Math.min(10, p.stock ?? 10)}
                      />
                      <button
                        className="text-link"
                        onClick={() => {
                          if (!isWishlisted(productId(p))) toggleWishlist(p);
                          removeFromCart(productId(p));
                        }}
                      >
                        <FiHeart />
                        Save for later
                      </button>
                    </div>
                  </div>
                  <div className="bag-item-end">
                    <strong>{money(p.price * p.quantity)}</strong>
                    <button
                      className="icon-button"
                      aria-label={`Remove ${p.name} from bag`}
                      onClick={() => removeFromCart(productId(p))}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <p className="bag-footnote">
              Something caught your eye?{" "}
              <Link href="/wishlist">Your saved finds are right here ↗</Link>
            </p>
          </div>
          <OrderSummary />
        </div>
      )}
    </div>
  );
}
