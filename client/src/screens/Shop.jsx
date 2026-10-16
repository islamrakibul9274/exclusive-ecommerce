"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FiSearch, FiSliders, FiX, FiArrowRight, FiGrid } from "react-icons/fi";
import { useCatalog } from "../context/CatalogContext";
import { categoryGroups } from "../lib/catalog";
import ProductCard from "../components/ProductCard";
import { Breadcrumb, Button, EmptyState, LoadState } from "../components/UI";
export default function Shop() {
  const { products, loading, error, refresh } = useCatalog(),
    params = useSearchParams(),
    router = useRouter();
  const [showFilters, setShowFilters] = useState(false),
    [limit, setLimit] = useState(9),
    [search, setSearch] = useState(params.get("q") || "");
  const category = params.get("category") || "All",
    query = params.get("q") || "",
    sort = params.get("sort") || "newest",
    min = Number(params.get("min")) || 0,
    max = Number(params.get("max")) || Infinity,
    sale = params.get("sale") === "true",
    stock = params.get("stock") === "true";
  function update(key, value) {
    const p = new URLSearchParams(params.toString());
    if (value && value !== "All" && value !== "newest") p.set(key, value);
    else p.delete(key);
    router.replace(`/shop${p.size ? "?" + p.toString() : ""}`, {
      scroll: false,
    });
    setLimit(9);
  }
  function clear() {
    router.replace("/shop", { scroll: false });
    setSearch("");
    setLimit(9);
  }
  const filtered = products
    .filter(
      (p) =>
        (category === "All" || p.group === category) &&
        (!query ||
          `${p.name} ${p.description} ${p.category}`
            .toLowerCase()
            .includes(query.toLowerCase())) &&
        p.price >= min &&
        p.price <= max &&
        (!sale || p.discount > 0) &&
        (!stock || p.stock > 0),
    )
    .sort((a, b) =>
      sort === "price-low"
        ? a.price - b.price
        : sort === "price-high"
          ? b.price - a.price
          : sort === "rating"
            ? (b.rating || 0) - (a.rating || 0)
            : 0,
    );
  const active =
    category !== "All" || query || min || Number.isFinite(max) || sale || stock;
  return (
    <div className="container shop-page">
      <Breadcrumb items={[{ label: "The collection" }]} />
      <div className="page-heading shop-heading">
        <div>
          <span className="eyebrow">THE WHOLE GOOD THING</span>
          <h1>
            Find your next
            <br />
            <em>favorite.</em>
          </h1>
        </div>
        <p>
          For the way you live, work, and play.
          <br />A considered collection, ready to explore.
        </p>
      </div>
      <div className="shop-toolbar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update("q", search.trim());
          }}
          className="shop-search"
        >
          <FiSearch />
          <input
            aria-label="Search products"
            placeholder="Search the collection…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setSearch("");
                update("q", "");
              }}
            >
              <FiX />
            </button>
          )}
          <button className="search-submit" aria-label="Search">
            <FiArrowRight />
          </button>
        </form>
        <button
          className="button outline filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiSliders />
          Filters
        </button>
        <label className="sort-select">
          <span>Sort by</span>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
          >
            <option value="newest">Latest arrivals</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Highest rated</option>
          </select>
        </label>
      </div>
      <div className="shop-body">
        <aside className={`filters ${showFilters ? "open" : ""}`}>
          <div className="filter-title">
            <h2>Refine your finds</h2>
            <button onClick={clear}>Reset</button>
          </div>
          <fieldset>
            <legend>Category</legend>
            {categoryGroups.map((c) => (
              <label
                className={`filter-category ${category === c ? "active" : ""}`}
                key={c}
              >
                <input
                  type="radio"
                  name="category"
                  value={c}
                  checked={category === c}
                  onChange={() => update("category", c)}
                />
                <span>{c === "All" ? "All products" : c}</span>
                <small>
                  {products.filter((p) => c === "All" || p.group === c).length}
                </small>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Price range</legend>
            <div className="price-range">
              <label>
                <span>Min $</span>
                <input
                  aria-label="Minimum price"
                  type="number"
                  min="0"
                  value={min || ""}
                  placeholder="0"
                  onChange={(e) => update("min", e.target.value)}
                />
              </label>
              <span>—</span>
              <label>
                <span>Max $</span>
                <input
                  aria-label="Maximum price"
                  type="number"
                  min="0"
                  value={Number.isFinite(max) ? max : ""}
                  placeholder="Any"
                  onChange={(e) => update("max", e.target.value)}
                />
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>A little more specific</legend>
            <label className="check-field">
              <input
                type="checkbox"
                checked={stock}
                onChange={(e) =>
                  update("stock", e.target.checked ? "true" : "")
                }
              />
              In stock only
            </label>
            <label className="check-field">
              <input
                type="checkbox"
                checked={sale}
                onChange={(e) => update("sale", e.target.checked ? "true" : "")}
              />
              On offer
            </label>
          </fieldset>
          <div className="filter-promo">
            <span className="star-symbol">✳</span>
            <h3>A warm welcome.</h3>
            <p>Use WELCOME10 for 10% off your bag, up to $50.</p>
          </div>
        </aside>
        <div className="shop-results">
          <div className="results-label">
            <span>
              {loading
                ? "Finding the good things…"
                : `${filtered.length} ${filtered.length === 1 ? "find" : "finds"}${query ? ` for “${query}”` : ""}`}
            </span>
            {active && (
              <button className="text-link" onClick={clear}>
                Clear filters <FiX />
              </button>
            )}
          </div>
          {loading || error ? (
            <LoadState error={error} retry={refresh} count={6} />
          ) : filtered.length ? (
            <>
              <div className="product-grid shop-grid">
                {filtered.slice(0, limit).map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              {filtered.length > limit && (
                <div className="center-action">
                  <Button
                    variant="outline"
                    onClick={() => setLimit((n) => n + 9)}
                  >
                    See more good things
                    <FiArrowRight />
                  </Button>
                </div>
              )}
              <p className="results-bottom">
                You’ve seen {Math.min(limit, filtered.length)} of{" "}
                {filtered.length} finds.
              </p>
            </>
          ) : (
            <EmptyState
              icon={FiSearch}
              title="No finds, just yet."
              description="Try a broader search or give those filters a little breathing room."
              href={null}
            />
          )}
        </div>
      </div>
    </div>
  );
}
