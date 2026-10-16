"use client";
import Link from "next/link";
import { useState } from "react";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiTruck,
  FiPackage,
  FiShield,
  FiHeadphones,
  FiMonitor,
  FiGrid,
} from "react-icons/fi";
import { TbDeviceGamepad2, TbHanger, TbArmchair } from "react-icons/tb";
import { useCatalog } from "../context/CatalogContext";
import { useCart } from "../context/CartContext";
import { categoryGroups, money } from "../lib/catalog";
import ProductCard from "../components/ProductCard";
import { Button, SectionHeading, LoadState } from "../components/UI";
export default function Home() {
  const { products, loading, error, refresh } = useCatalog(),
    { recent } = useCart();
  const [category, setCategory] = useState("All");
  const featured =
    products.find((p) => /playstation/i.test(p.name)) || products[0];
  const picks = products
    .filter((p) => category === "All" || p.group === category)
    .slice(0, 8);
  const recently = recent
    .map((id) => products.find((p) => p._id === id))
    .filter(Boolean)
    .slice(0, 4);
  const categories = [
    ["Gaming", TbDeviceGamepad2, "Play a little more"],
    ["Tech & workspace", FiMonitor, "Make space for focus"],
    ["Fashion", TbHanger, "Wear your everyday"],
    ["Home & living", TbArmchair, "Make yourself at home"],
  ];
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="tiny-dot" /> THE EVERYDAY, RECONSIDERED{" "}
              <span>VOL. 01</span>
            </div>
            <h1>
              Good things.
              <br />
              Great prices.
              <br />
              <em>More you.</em>
            </h1>
            <p>
              Considered finds for the way you live, work, and play.
              <br className="desktop-only" /> Discover a little something worth
              making room for.
            </p>
            <div className="hero-actions">
              <Button href="/shop">
                Explore the collection
                <FiArrowUpRight />
              </Button>
              <span>
                Good taste comes
                <br />
                in all price ranges.
              </span>
            </div>
            <div className="hero-note">
              <span className="star-symbol">✳</span>
              <span>
                A little welcome, on us.
                <br />
                <strong>10% off with WELCOME10</strong>
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit" />
            <div className="hero-edition">
              THE PLAY EDIT <span>01 — 04</span>
            </div>
            <img
              className="hero-product"
              src="/images/playstation.webp"
              alt="PlayStation 5 console and DualSense controller"
              width="1000"
              height="1000"
              fetchPriority="high"
            />
            <div className="hero-stamp">
              PRESS
              <br />
              <strong>PLAY.</strong>
              <FiArrowUpRight />
            </div>
            {featured && (
              <Link
                className="hero-product-caption"
                href={`/product/${featured._id}`}
              >
                <div>
                  <small>THE SPOTLIGHT</small>
                  <strong>{featured.name}</strong>
                  <span>From {money(featured.price)}</span>
                </div>
                <span className="round-arrow">
                  <FiArrowUpRight />
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>
      <div className="promise-strip">
        <div className="container">
          <span>
            <FiTruck />
            Free shipping on orders $150+
          </span>
          <span>
            <FiPackage />
            30-day return window
          </span>
          <span>
            <FiShield />
            Secure checkout
          </span>
          <span>
            <FiHeadphones />A real support inbox
          </span>
        </div>
      </div>
      <div className="container">
        <section className="category-section">
          <div className="small-heading">
            <span>FIND YOUR EVERYDAY</span>
            <span>
              Explore by category <FiArrowRight />
            </span>
          </div>
          <div className="category-grid">
            {categories.map(([label, Icon, copy], i) => (
              <Link
                key={label}
                href={`/shop?category=${encodeURIComponent(label)}`}
                className="category-tile"
              >
                <span className="category-number">0{i + 1}</span>
                <Icon />
                <div>
                  <h3>{label}</h3>
                  <p>{copy}</p>
                </div>
                <FiArrowUpRight className="category-arrow" />
              </Link>
            ))}
          </div>
        </section>
        <section className="section-space">
          <SectionHeading
            eyebrow="THE EXCLUSIVE EDIT"
            title={
              <>
                Worth a <em>closer look.</em>
              </>
            }
            link="Shop everything"
          />
          <div className="category-tabs" aria-label="Filter featured products">
            {categoryGroups.map((c) => (
              <button
                key={c}
                className={category === c ? "active" : ""}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          {loading || error ? (
            <LoadState error={error} retry={refresh} />
          ) : (
            <div className="product-grid">
              {picks.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
          {!loading && !error && picks.length === 0 && (
            <p className="muted">
              New finds are on their way. Explore another category.
            </p>
          )}
          <div className="center-action">
            <Button variant="outline" href="/shop">
              Discover all {products.length || ""} finds
              <FiArrowRight />
            </Button>
          </div>
        </section>
        <section className="editorial-banner">
          <div className="editorial-copy">
            <span className="eyebrow">YOUR SPACE. YOUR RULES.</span>
            <h2>
              A home for
              <br />
              <em>your good days.</em>
            </h2>
            <p>
              Little details. A fresh perspective.
              <br />
              Find the things that make your space feel like you.
            </p>
            <Button variant="light" href="/shop?category=Home%20%26%20living">
              Make room for something good
              <FiArrowUpRight />
            </Button>
          </div>
          <div className="editorial-photo">
            <img
              src="/images/studio.webp"
              alt="A thoughtfully furnished contemporary living space"
              loading="lazy"
            />
            <span className="photo-label">THE HOME EDIT ↗</span>
          </div>
        </section>
        <section className="section-space">
          <SectionHeading
            eyebrow="LESS SCROLLING. MORE FINDING."
            title={
              <>
                Find your kind of <em>everyday.</em>
              </>
            }
            link="Meet the collection"
          />
          <div className="collection-grid">
            {[
              ["Gaming", "For your next great escape.", "controller", "01"],
              ["Fashion", "Good plans start here.", "coat", "02"],
              ["Tech & workspace", "A fresh point of view.", "monitor", "03"],
            ].map(([group, title, image, n]) => (
              <Link
                className={`collection-card collection-${image}`}
                href={`/shop?category=${encodeURIComponent(group)}`}
                key={group}
              >
                <div className="collection-photo">
                  <img
                    src={`/images/${image}.webp`}
                    alt={`${group} collection`}
                    loading="lazy"
                  />
                  <span>
                    {n} / THE {group.split(" ")[0].toUpperCase()} EDIT
                  </span>
                </div>
                <div>
                  <h3>{title}</h3>
                  <FiArrowUpRight />
                </div>
              </Link>
            ))}
          </div>
        </section>
        {recently.length > 0 && (
          <section className="section-space">
            <SectionHeading
              eyebrow="STILL ON YOUR MIND?"
              title={
                <>
                  A second <em>look.</em>
                </>
              }
            />
            <div className="product-grid">
              {recently.map((p) => (
                <ProductCard product={p} key={p._id} />
              ))}
            </div>
          </section>
        )}
        <section className="values-section">
          <div>
            <span className="eyebrow">A LITTLE MORE EXCLUSIVE</span>
            <h2>
              Everyday things.
              <br />
              <em>Considered differently.</em>
            </h2>
          </div>
          <div className="value-item">
            <span>01</span>
            <h3>Finds with a point of view.</h3>
            <p>
              A small, browsable collection across your world. Find what speaks
              to you.
            </p>
          </div>
          <div className="value-item">
            <span>02</span>
            <h3>Keep the good ones close.</h3>
            <p>
              Save your favorites, build your bag, and pick up right where you
              left off.
            </p>
          </div>
          <div className="value-item">
            <span>03</span>
            <h3>Here for the whole journey.</h3>
            <p>
              From your first question to your order arriving, support is a
              message away.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
