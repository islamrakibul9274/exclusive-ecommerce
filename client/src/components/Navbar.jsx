"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiArrowUpRight,
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiArrowRight,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { totalItems, wishlist } = useCart(),
    { user } = useAuth(),
    path = usePathname(),
    router = useRouter();
  const [menu, setMenu] = useState(false),
    [query, setQuery] = useState("");
  function search(e) {
    e.preventDefault();
    setMenu(false);
    router.push(
      `/shop${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`,
    );
  }
  const links = [
    ["Discover", "/"],
    ["Shop all", "/shop"],
    ["Our story", "/about"],
    ["Get in touch", "/contact"],
  ];
  return (
    <>
      <div className="announcement">
        <p>
          A little welcome, on us. <span>10% off with WELCOME10</span>
        </p>
        <Link href="/shop">
          Find your next favorite <FiArrowUpRight />
        </Link>
      </div>
      <header
        className="site-header"
        onClick={(event) => {
          if (event.target.closest("a")) setMenu(false);
        }}
      >
        <div className="container nav-main">
          <Link className="logo" href="/" aria-label="Exclusive home">
            exclusive<span>✳</span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map(([label, href]) => (
              <Link
                key={href}
                className={path === href ? "active" : ""}
                href={href}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <form className="nav-search" onSubmit={search}>
              <input
                aria-label="Search the collection"
                placeholder="Find something good…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button aria-label="Search">
                <FiSearch />
              </button>
            </form>
            <Link
              className="icon-button desktop-account"
              href={user ? "/account" : "/login"}
              aria-label={user ? "Your account" : "Sign in"}
            >
              <FiUser />
            </Link>
            <Link
              className="icon-button"
              href="/wishlist"
              aria-label={`Wishlist, ${wishlist.length} items`}
            >
              <FiHeart />
              {wishlist.length > 0 && (
                <span className="badge">{wishlist.length}</span>
              )}
            </Link>
            <Link
              className="icon-button"
              href="/cart"
              aria-label={`Shopping bag, ${totalItems} items`}
            >
              <FiShoppingBag />
              {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </Link>
            <button
              className="icon-button mobile-menu-button"
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
        {menu && (
          <div className="mobile-menu">
            <form className="mobile-search" onSubmit={search}>
              <FiSearch />
              <input
                aria-label="Search"
                placeholder="What are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button aria-label="Submit search">
                <FiArrowRight />
              </button>
            </form>
            <nav>
              {links.map(([label, href]) => (
                <Link href={href} key={href}>
                  {label}
                  <FiArrowUpRight />
                </Link>
              ))}
              <Link href={user ? "/account" : "/login"}>
                {user
                  ? `Hello, ${user.name.split(" ")[0]}`
                  : "Sign in / create account"}
                <FiUser />
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin">
                  Store management
                  <FiArrowUpRight />
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
