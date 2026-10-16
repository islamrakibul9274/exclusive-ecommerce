"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export default function MainLayout({ children }) {
  return (
    <div id="top">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}
