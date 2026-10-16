"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiEye, FiEyeOff, FiArrowRight, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Button, Field } from "../components/UI";
export default function Auth({ signup = false }) {
  const { saveSession } = useAuth(),
    router = useRouter(),
    params = useSearchParams();
  const [visible, setVisible] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const next = params.get("next");
  const destination =
    next?.startsWith("/") && !next.startsWith("//") ? next : "/account";
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (signup) {
        const res = await fetch("/api/users/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.message);
      }
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message);
      saveSession(payload);
      toast.success(signup ? "Welcome to Exclusive" : "Welcome back");
      router.push(destination);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-layout">
      <div className="auth-art">
        <span className="eyebrow">MAKE YOURSELF AT HOME</span>
        <img src="/images/controller.webp" alt="A white game controller" />
        <h2>
          A little more
          <br />
          <em>your kind of everyday.</em>
        </h2>
      </div>
      <div className="auth-form-wrap">
        <span className="eyebrow">
          {signup ? "YOUR NEXT CHAPTER" : "GOOD TO SEE YOU AGAIN"}
        </span>
        <h1>
          {signup ? (
            <>
              Good things <em>start here.</em>
            </>
          ) : (
            <>
              Welcome <em>back.</em>
            </>
          )}
        </h1>
        <p>
          {signup
            ? "Save your favorites. Track your finds. Make it yours."
            : "Sign in for your saved finds and everyday favorites."}
        </p>
        <form className="auth-form" onSubmit={submit}>
          {signup && (
            <Field
              label="Your name"
              name="name"
              required
              autoComplete="name"
              maxLength={100}
              placeholder="What should we call you?"
            />
          )}
          <Field
            label="Email address"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
          />
          <Field label="Password">
            <div className="password-input">
              <input
                name="password"
                type={visible ? "text" : "password"}
                required
                minLength={signup ? 8 : 1}
                maxLength={72}
                autoComplete={signup ? "new-password" : "current-password"}
                placeholder={signup ? "At least 8 characters" : "Your password"}
              />
              <button
                type="button"
                aria-label={visible ? "Hide password" : "Show password"}
                onClick={() => setVisible(!visible)}
              >
                {visible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </Field>
          {error && (
            <div className="notice error" role="alert">
              {error}
            </div>
          )}
          <Button disabled={busy}>
            {busy ? "One moment…" : signup ? "Create your account" : "Sign in"}
            <FiArrowRight />
          </Button>
        </form>
        <p className="auth-switch">
          {signup ? "Already part of the club?" : "New around here?"}
          <Link
            href={`${signup ? "/login" : "/signup"}?next=${encodeURIComponent(destination)}`}
          >
            {signup ? "Sign in" : "Create an account"}
          </Link>
        </p>
        <p className="auth-footnote">
          {signup ? (
            <>
              By creating an account, you agree to our{" "}
              <Link href="/policies">terms and privacy policy</Link>.
            </>
          ) : (
            <>
              Need help accessing your account?{" "}
              <Link href="/contact?subject=Account%20help">Get in touch</Link>.
            </>
          )}
        </p>
        <p className="auth-footnote">
          <FiLock style={{ display: "inline", marginRight: 6 }} />
          Your details stay in your account.
        </p>
      </div>
    </div>
  );
}
