"use client";
import Link from "next/link";
import { useState, useCallback } from "react";
import { FiHeart, FiPlus, FiArrowUpRight, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { money, productId } from "../lib/catalog";
import { Button, Modal } from "./UI";
export default function ProductCard({ product, compact = false }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [quick, setQuick] = useState(false);
  const close = useCallback(() => setQuick(false), []);
  const id = productId(product),
    saved = isWishlisted(id);
  return (
    <>
      <article className={`product-card ${compact ? "compact" : ""}`}>
        <div className="product-image-wrap">
          <Link href={`/product/${id}`} className="product-image-link">
            <img
              className="product-photo"
              src={product.image}
              alt={product.name}
              width="640"
              height="640"
              loading="lazy"
              onError={(e) => {
                if (!e.currentTarget.dataset.failed) {
                  e.currentTarget.dataset.failed = "1";
                  e.currentTarget.src = "/images/placeholder.svg";
                }
              }}
            />
          </Link>
          <div className="product-labels">
            {product.stock === 0 ? (
              <span className="tag neutral">Sold out</span>
            ) : product.discount > 0 ? (
              <span className="tag">−{product.discount}%</span>
            ) : (
              <span className="tag neutral">Selected</span>
            )}
          </div>
          <button
            className={`save-button ${saved ? "saved" : ""}`}
            aria-label={`${saved ? "Remove" : "Save"} ${product.name}${saved ? " from" : " to"} wishlist`}
            aria-pressed={saved}
            onClick={() => toggleWishlist(product)}
          >
            <FiHeart />
          </button>
          <button className="quick-view" onClick={() => setQuick(true)}>
            Quick look <FiArrowUpRight />
          </button>
        </div>
        <div className="product-meta">
          <span className="product-category">
            {product.group || product.category}
          </span>
          <Link href={`/product/${id}`}>
            <h3>{product.name}</h3>
          </Link>
          <div className="product-bottom">
            <div className="price">
              {money(product.price)}
              {product.oldPrice > product.price && (
                <del>{money(product.oldPrice)}</del>
              )}
            </div>
            <button
              className="add-button"
              disabled={!product.stock}
              aria-label={`Add ${product.name} to bag`}
              onClick={() => addToCart(product)}
            >
              <FiPlus />
            </button>
          </div>
        </div>
      </article>
      {quick && (
        <Modal title="A closer look" onClose={close} wide>
          <div className="quick-product">
            <img src={product.image} alt={product.name} />
            <div>
              <span className="eyebrow">{product.group}</span>
              <h2>{product.name}</h2>
              <p className="price large">
                {money(product.price)}
                {product.oldPrice > product.price && (
                  <del>{money(product.oldPrice)}</del>
                )}
              </p>
              <p>{product.description}</p>
              <Button
                disabled={!product.stock}
                onClick={() => {
                  addToCart(product);
                  close();
                }}
              >
                <FiShoppingBag />
                {product.stock ? "Add to bag" : "Sold out"}
              </Button>
              <Link
                href={`/product/${id}`}
                className="text-link"
                onClick={close}
              >
                View product details <FiArrowUpRight />
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
