"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  FiArrowRight,
  FiX,
  FiMinus,
  FiPlus,
  FiRefreshCw,
} from "react-icons/fi";
export function Button({
  children,
  href,
  variant = "",
  className = "",
  ...props
}) {
  const cls = `button ${variant} ${className}`;
  return href ? (
    <Link href={href} className={cls} {...props}>
      {children}
    </Link>
  ) : (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
export function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((item, i) => (
        <span key={i}>
          <span className="breadcrumb-slash">/</span>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  link,
  href = "/shop",
  children,
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {children}
      </div>
      {link && (
        <Link className="text-link" href={href}>
          {link}
          <FiArrowRight />
        </Link>
      )}
    </div>
  );
}
export function Quantity({ value, onChange, max = 10 }) {
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <FiMinus />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <FiPlus />
      </button>
    </div>
  );
}
export function EmptyState({
  icon: Icon,
  title,
  description,
  href = "/shop",
  action = "Explore the collection",
}) {
  return (
    <div className="empty-state">
      {Icon && (
        <span className="empty-icon">
          <Icon />
        </span>
      )}
      <h2>{title}</h2>
      <p>{description}</p>
      {href && (
        <Button href={href}>
          {action}
          <FiArrowRight />
        </Button>
      )}
    </div>
  );
}
export function LoadState({ error, retry, count = 4 }) {
  return error ? (
    <div className="notice error">
      <p>{error}</p>
      <button className="text-link" onClick={retry}>
        Try again <FiRefreshCw />
      </button>
    </div>
  ) : (
    <div className="product-grid">
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton-card" key={i}>
          <div />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
export function Modal({ title, onClose, children, wide = false }) {
  const dialog = useRef(null);
  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const previous = document.activeElement;
    dialog.current?.focus();
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const list = dialog.current?.querySelectorAll(
          'button,a,input,select,textarea,[tabindex="0"]',
        );
        if (!list?.length) return;
        const first = list[0],
          last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        ref={dialog}
        className={`modal ${wide ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
export function Field({ label, error, children, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children || <input {...props} />}{" "}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
