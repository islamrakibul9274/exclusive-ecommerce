"use client";
import Link from "next/link";
import { useState } from "react";
import { FiArrowRight, FiCheck, FiArrowUpRight } from "react-icons/fi";
import toast from "react-hot-toast";
export default function Footer() {
  const [email, setEmail] = useState(""),
    [busy, setBusy] = useState(false),
    [done, setDone] = useState(false);
  async function subscribe(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDone(true);
      toast.success(data.message);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <footer className="footer">
      <div className="container">
        <div className="newsletter">
          <div>
            <span className="eyebrow">Good things, occasionally.</span>
            <h2>
              Your next favorite.
              <br />
              <em>In your inbox.</em>
            </h2>
          </div>
          <div>
            <p>
              New finds, considered collections, and a little inspiration.
              <br />
              Join the Exclusive edit.
            </p>
            <form onSubmit={subscribe}>
              <input
                type="email"
                aria-label="Email for newsletter"
                placeholder="Your email address"
                required
                value={email}
                disabled={done}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                disabled={busy || done}
                aria-label="Subscribe to newsletter"
              >
                {done ? <FiCheck /> : <FiArrowRight />}
              </button>
            </form>
            <small>
              {done
                ? "You’re on the list. Welcome to the club."
                : "By subscribing, you agree to our privacy policy."}
            </small>
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-brand">
            <Link className="logo" href="/">
              exclusive<span>✳</span>
            </Link>
            <p>
              Considered finds. Everyday possibilities.
              <br />A little more you.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/shop">All products</Link>
            <Link href="/shop?category=Gaming">Gaming</Link>
            <Link href="/shop?category=Fashion">Fashion</Link>
            <Link href="/shop?category=Home%20%26%20living">Home & living</Link>
          </div>
          <div>
            <h3>Here to help</h3>
            <Link href="/help">Shipping & returns</Link>
            <Link href="/help#questions">Common questions</Link>
            <Link href="/contact">Contact us</Link>
            <Link href="/account?tab=orders">Track your order</Link>
          </div>
          <div>
            <h3>Make yourself at home</h3>
            <Link href="/about">Our story</Link>
            <Link href="/account">Your account</Link>
            <Link href="/wishlist">Your wishlist</Link>
            <Link href="/credits">
              Image credits <FiArrowUpRight />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Exclusive. All rights reserved.
          </span>
          <div>
            <Link href="/policies">Privacy & terms</Link>
            <span>USD $ · English</span>
          </div>
          <a href="#top" className="back-top">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
