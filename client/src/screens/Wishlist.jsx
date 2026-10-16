"use client";
import { FiHeart, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { Breadcrumb, Button, EmptyState, LoadState } from "../components/UI";
import ProductCard from "../components/ProductCard";
export default function Wishlist() {
  const { wishlist, loaded, addToCart } = useCart();
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: "Your wishlist" }]} />
      <div className="page-heading">
        <div>
          <span className="eyebrow">KEEP THE GOOD ONES CLOSE</span>
          <h1>
            Saved for <em>later.</em>
          </h1>
          <p>
            {wishlist.length} {wishlist.length === 1 ? "favorite" : "favorites"}
            , all in one place.
          </p>
        </div>
        {wishlist.length > 0 && (
          <Button
            variant="outline"
            onClick={() =>
              wishlist.filter((p) => p.stock > 0).forEach((p) => addToCart(p))
            }
          >
            <FiShoppingBag />
            Add available items to bag
          </Button>
        )}
      </div>
      {!loaded ? (
        <LoadState />
      ) : wishlist.length ? (
        <div className="product-grid">
          {wishlist.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiHeart}
          title="Make a little room for favorites."
          description="Tap the heart on anything you love. We’ll keep it right here for your next visit."
        />
      )}
    </div>
  );
}
