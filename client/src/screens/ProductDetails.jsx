"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  FiHeart,
  FiShoppingBag,
  FiShare2,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiArrowRight,
  FiZoomIn,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useCatalog } from "../context/CatalogContext";
import { useCart } from "../context/CartContext";
import { money } from "../lib/catalog";
import {
  Breadcrumb,
  Button,
  Quantity,
  EmptyState,
  SectionHeading,
  Modal,
} from "../components/UI";
import ProductCard from "../components/ProductCard";
export default function ProductDetails() {
  const { id } = useParams();
  const { products } = useCatalog(),
    { addToCart, toggleWishlist, isWishlisted, viewProduct } = useCart();
  const viewed = useRef(viewProduct);
  const [product, setProduct] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [quantity, setQuantity] = useState(1),
    [tab, setTab] = useState("details"),
    [zoom, setZoom] = useState(false);
  const closeZoom = useCallback(() => setZoom(false), []);
  useEffect(() => {
    let alive = true;
    fetch(`/api/products/${id}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.message);
        if (alive) {
          setProduct(d);
          viewed.current(id);
        }
      })
      .catch((e) => {
        if (alive) setError(e.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);
  if (loading)
    return (
      <div className="container page-space">
        <div className="detail-skeleton">
          <div />
          <div />
        </div>
      </div>
    );
  if (error || !product)
    return (
      <div className="container">
        <EmptyState
          icon={FiShoppingBag}
          title="This find is out of reach."
          description={error || "The product is no longer available."}
        />
      </div>
    );
  const saved = isWishlisted(product._id),
    related = products
      .filter((p) => p._id !== id && p.group === product.group)
      .concat(products.filter((p) => p._id !== id && p.group !== product.group))
      .slice(0, 4);
  return (
    <div className="container product-page">
      <Breadcrumb
        items={[
          { label: "The collection", href: "/shop" },
          { label: product.name },
        ]}
      />
      <div className="product-detail">
        <div>
          <button
            className="detail-image"
            onClick={() => setZoom(true)}
            aria-label="Enlarge product image"
          >
            <span className="detail-image-label">
              THE {product.group.split(" ")[0].toUpperCase()} EDIT
            </span>
            <img
              src={product.image}
              alt={product.name}
              width="1200"
              height="1200"
            />
            <span className="zoom-label">
              <FiZoomIn />A closer look
            </span>
          </button>
          {product.representativeImage && (
            <p className="image-note">
              Openly licensed, representative product photography.{" "}
              <Link href="/credits">Image credits ↗</Link>
            </p>
          )}
        </div>
        <div className="detail-info">
          <span className="eyebrow">{product.group}</span>
          <h1>{product.name}</h1>
          <div className="detail-price">
            <span className="price large">
              {money(product.price)}
              {product.oldPrice > product.price && (
                <del>{money(product.oldPrice)}</del>
              )}
            </span>
            {product.discount > 0 && (
              <span className="tag">Save {product.discount}%</span>
            )}
          </div>
          <p className={`stock-line ${!product.stock ? "sold-out" : ""}`}>
            <span />
            {product.stock > 0
              ? `In stock · ${product.stock} available`
              : "Currently sold out"}
          </p>
          <p className="detail-description">{product.description}</p>
          <div className="detail-purchase">
            <Quantity
              value={quantity}
              onChange={setQuantity}
              max={Math.min(10, product.stock)}
            />
            <Button
              disabled={!product.stock}
              onClick={() => addToCart(product, quantity)}
            >
              <FiShoppingBag />
              {product.stock ? "Add to bag" : "Sold out"}
            </Button>
            <button
              className={`icon-button favorite-detail ${saved ? "saved" : ""}`}
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={saved}
              onClick={() => toggleWishlist(product)}
            >
              <FiHeart />
            </button>
          </div>
          <div className="detail-promises">
            <span>
              <FiTruck />
              Free shipping on orders $150+
            </span>
            <span>
              <FiRefreshCw />
              30-day return window
            </span>
            <span>
              <FiShield />
              Secure checkout · Cash on delivery available
            </span>
          </div>
          <div className="detail-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={tab === "details"}
              className={tab === "details" ? "active" : ""}
              onClick={() => setTab("details")}
            >
              The details
            </button>
            <button
              role="tab"
              aria-selected={tab === "delivery"}
              className={tab === "delivery" ? "active" : ""}
              onClick={() => setTab("delivery")}
            >
              Delivery & returns
            </button>
          </div>
          <div className="detail-tab-content" role="tabpanel">
            {tab === "details" ? (
              <dl>
                <div>
                  <dt>Category</dt>
                  <dd>{product.category}</dd>
                </div>
                <div>
                  <dt>Product reference</dt>
                  <dd>EX-{id.slice(-6).toUpperCase()}</dd>
                </div>
                <div>
                  <dt>Availability</dt>
                  <dd>
                    {product.stock
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </dd>
                </div>
              </dl>
            ) : (
              <p>
                Standard shipping is $9, or free on orders of $150 or more.
                Delivery timing is confirmed after your order is placed. Request
                a return within 30 days of delivery for eligible, unused items.{" "}
                <Link href="/help">Read the full details ↗</Link>
              </p>
            )}
          </div>
          <button
            className="text-link share-product"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Product link copied");
              } catch {
                toast.error("Copy the address from your browser to share.");
              }
            }}
          >
            <FiShare2 />
            Share this find
          </button>
        </div>
      </div>
      <section className="section-space">
        <SectionHeading
          eyebrow="GOOD COMPANY"
          title={
            <>
              You might also <em>like.</em>
            </>
          }
          link="Keep exploring"
        />
        <div className="product-grid">
          {related.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
      {zoom && (
        <Modal title={product.name} onClose={closeZoom} wide>
          <img className="zoom-image" src={product.image} alt={product.name} />
        </Modal>
      )}
    </div>
  );
}
