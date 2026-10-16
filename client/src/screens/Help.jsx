import Link from "next/link";
import { Breadcrumb, Button } from "../components/UI";
const groups = [
  [
    "shipping",
    "Shipping & delivery",
    [
      [
        "How much is shipping?",
        "Standard shipping is $9 per order. Shipping is free when your bag subtotal reaches $150, before any offer-code discount. Your final total is shown at checkout.",
      ],
      [
        "When will my order arrive?",
        "Delivery timing depends on your address and the items ordered. Timing is confirmed after an order is placed. You can follow its status from Your Account → Your Orders. Contact support with your order reference if you need a delivery update.",
      ],
      [
        "Where do I add my delivery details?",
        "Enter a full delivery address and phone number during checkout. You can save the address to your account to make your next order easier. If you need to change details after ordering, contact support before the order ships.",
      ],
    ],
  ],
  [
    "returns",
    "Returns & cancellations",
    [
      [
        "Can I return a product?",
        "Contact support within 30 days of delivery to request a return. Eligible products should be unused and in their original packaging. Include your order reference, the item, and the reason for your request. Support will confirm eligibility and the next steps before you send anything back.",
      ],
      [
        "Can I cancel an order?",
        "You can cancel a pending cash-on-delivery order from your account before it ships. Paid card orders need a cancellation and refund arranged through support. Shipped and delivered orders cannot be cancelled in the account; contact support about return options.",
      ],
      [
        "What if my item arrives damaged?",
        "Send a support message with your order reference and a clear description of the issue as soon as possible. Keep the item and packaging while support reviews the problem.",
      ],
    ],
  ],
  [
    "questions",
    "Shopping & payments",
    [
      [
        "How does the welcome offer work?",
        "Enter WELCOME10 in your bag to take 10% off the product subtotal, up to $50. Shipping is calculated before the discount. You can remove the code from your bag at any time.",
      ],
      [
        "Which payment methods can I use?",
        "Checkout offers cash on delivery and Stripe card payments. If the storefront is running with test payment keys, checkout clearly identifies test mode and no real money is charged.",
      ],
      [
        "How do I save a favorite?",
        "Tap the heart on any product. Your wishlist is saved in this browser so you can return to it later. Clearing browser storage will clear locally saved favorites and your bag.",
      ],
      [
        "How do I change my password?",
        "Sign in, open Your Account, and select Password. You will need your current password. If you cannot access your account, contact support for assistance.",
      ],
      [
        "Are the product images exact?",
        "The catalog uses openly licensed representative product photography where original images were too small. Those product pages are marked accordingly. Check the product details and ask support about exact specifications before ordering.",
      ],
    ],
  ],
];
export default function Help() {
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: "Here to help" }]} />
      <div className="page-heading">
        <div>
          <span className="eyebrow">A LITTLE CLARITY</span>
          <h1>
            Good questions.
            <br />
            <em>Straight answers.</em>
          </h1>
          <p>Here’s the practical stuff, all in one place.</p>
        </div>
      </div>
      <div className="faq-layout">
        <aside className="faq-nav">
          {groups.map(([id, label]) => (
            <a href={`#${id}`} key={id}>
              {label} ↗
            </a>
          ))}
        </aside>
        <div>
          {groups.map(([id, label, questions]) => (
            <section className="faq-group" id={id} key={id}>
              <h2>{label}</h2>
              {questions.map(([q, a]) => (
                <details className="faq-item" key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </section>
          ))}
          <div className="notice">
            Still have something on your mind?{" "}
            <Link className="text-link" href="/contact">
              Send us a message ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
