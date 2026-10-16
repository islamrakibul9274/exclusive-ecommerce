"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiArrowUpRight, FiArrowRight, FiCheck } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { Breadcrumb, Button, Field } from "../components/UI";
export default function Contact() {
  const { user } = useAuth(),
    params = useSearchParams();
  const [busy, setBusy] = useState(false),
    [done, setDone] = useState(false),
    [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: "Get in touch" }]} />
      <div className="page-heading">
        <div>
          <span className="eyebrow">WE’RE ALL EARS</span>
          <h1>
            A good conversation
            <br />
            starts <em>here.</em>
          </h1>
          <p>
            A question, a little feedback, or help with a find. Send it our way.
          </p>
        </div>
      </div>
      <div className="contact-layout">
        <div className="contact-info">
          <h2>
            Let’s make it <em>simple.</em>
          </h2>
          <p>
            Your message goes straight to our store support inbox. Include your
            order reference if you’re asking about an order, so we can find the
            right details.
          </p>
          <div className="contact-links">
            <Link href="/help">
              Answers to common questions
              <FiArrowUpRight />
            </Link>
            <Link href="/account?tab=orders">
              Check your order status
              <FiArrowUpRight />
            </Link>
            <Link href="/help#returns">
              Returns & cancellations
              <FiArrowUpRight />
            </Link>
          </div>
          <div className="contact-tip">
            <h3>A little heads-up.</h3>
            <p>
              Please don’t send card numbers, passwords, or payment secrets.
              Your order reference is all we need to find your order.
            </p>
          </div>
        </div>
        {done ? (
          <div className="contact-success">
            <span className="success-check">
              <FiCheck />
            </span>
            <h2>Message received.</h2>
            <p>
              Your note is saved in our support inbox. Thanks for getting in
              touch.
            </p>
            <Button variant="outline" onClick={() => setDone(false)}>
              Send another message
              <FiArrowRight />
            </Button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="form-grid">
              <Field
                label="Your name"
                name="name"
                defaultValue={user?.name}
                required
                maxLength={100}
                autoComplete="name"
              />
              <Field
                label="Email address"
                name="email"
                type="email"
                defaultValue={user?.email}
                required
                maxLength={254}
                autoComplete="email"
              />
              <div className="full">
                <Field
                  label="What’s it about?"
                  name="subject"
                  defaultValue={params.get("subject") || ""}
                  placeholder="Order question, product help, or just hello…"
                  required
                  maxLength={150}
                />
              </div>
              <div className="full">
                <Field label="Your message">
                  <textarea
                    name="message"
                    required
                    minLength={10}
                    maxLength={4000}
                    rows={6}
                    placeholder="Tell us a little more. Include your order reference if you have one."
                  />
                </Field>
              </div>
            </div>
            <label className="honeypot" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            {error && (
              <div
                className="notice error"
                role="alert"
                style={{ marginTop: 20 }}
              >
                {error}
              </div>
            )}
            <div className="form-actions">
              <small className="muted">
                Your details are used to handle this message.
              </small>
              <Button disabled={busy}>
                {busy ? "Sending…" : "Send your message"}
                <FiArrowRight />
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
