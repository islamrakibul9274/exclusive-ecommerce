import Link from "next/link";
import { Breadcrumb } from "../components/UI";
export default function Policies() {
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: "Privacy & store information" }]} />
      <div className="page-heading">
        <div>
          <span className="eyebrow">THE PRACTICAL DETAILS</span>
          <h1>
            A clear <em>understanding.</em>
          </h1>
          <p>How this storefront handles your information and your orders.</p>
        </div>
      </div>
      <article className="policy-copy">
        <h2>Your account and orders</h2>
        <p>
          Account details, saved delivery addresses, and order records are
          stored in the store’s database. Passwords are stored as secure hashes.
          Order records contain the items purchased, their prices at checkout,
          your delivery details, and the order’s payment and fulfillment status.
        </p>
        <h2>Payment information</h2>
        <p>
          Card details are collected by Stripe’s payment form and are processed
          by Stripe. This store does not store your full card number or card
          security code. An order may store a Stripe payment reference so the
          payment can be verified. Checkout explicitly identifies test mode when
          test payment keys are in use.
        </p>
        <h2>Browser storage and session cookies</h2>
        <p>
          Your shopping bag, wishlist, viewed products, and applied offer code
          are saved in this browser. Sign-in uses a session cookie; the app also
          supports a local sign-in token. These support the account and shopping
          features. Clearing your browser data may sign you out and clear your
          locally saved items.
        </p>
        <h2>Messages and newsletter preferences</h2>
        <p>
          Support messages are saved with the name and email you provide so
          store administrators can review them. Newsletter subscriptions save
          your email and subscription preference. To request a change,
          unsubscribe, or ask about your information, use the contact form and
          describe your request.
        </p>
        <h2>Product information and pricing</h2>
        <p>
          Prices are in US dollars. The server checks current prices and
          available stock before accepting an order. Products can become
          unavailable between browsing and checkout. Some images are
          representative, openly licensed photographs rather than manufacturer
          images; those product pages carry a note and link to image credits.
        </p>
        <h2>Delivery, returns, and cancellations</h2>
        <p>
          Shipping charges and offer discounts are shown before you place an
          order. Review our{" "}
          <Link className="text-link" href="/help">
            shipping and returns information
          </Link>{" "}
          for delivery updates, eligible returns, and cancellation options. An
          order stays accessible from your account after it is placed.
        </p>
        <h2>Questions or requests</h2>
        <p>
          Use{" "}
          <Link className="text-link" href="/contact">
            the contact form
          </Link>{" "}
          for account, order, privacy, or newsletter requests. Please never
          include passwords, full card numbers, or other payment secrets in a
          message.
        </p>
      </article>
    </div>
  );
}
