# Exclusive

A full-stack Next.js storefront with a MongoDB catalog and one Vercel deployment. The previous Express source remains in `server/` for reference; the Next.js app calls its own `/api` routes and does not depend on Render.

**Live deployment:** [exclusive-ecommerce-mu.vercel.app](https://exclusive-ecommerce-mu.vercel.app)

## Run locally

Use Node.js 20.19 or newer. The Vercel project uses Node.js 24.

```sh
cd client
npm ci
cp .env.example .env.local
npm run dev
```

Set `MONGODB_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Keep `.env.local` out of Git. Include the database name in the MongoDB URI. The existing catalog is used directly; no seeding is required.

## Storefront

- Responsive shopping experience with a real catalog, search, category/price/stock filters, sorting, and product quick look.
- Persistent browser wishlist, shopping bag, recently viewed items, and offer codes.
- Server-calculated checkout totals, stock validation, cash on delivery, and Stripe card checkout. Test-mode keys are identified in checkout.
- Account profiles, saved delivery addresses, password changes, order history, receipts, and eligible pending-order cancellations.
- Admin inventory creation/editing/archiving, Cloudinary image uploads, order progression, and a customer-support inbox.
- Contact messages and newsletter subscriptions are saved in MongoDB. These forms do not send email automatically. Admin replies open the administrator’s email app.

Orders use database prices and reserve stock atomically. Paid orders require a matching verified Stripe payment. A repeated payment reference returns the existing order rather than creating another one. Cancelling an eligible cash order restores its stock; paid-order refunds are handled separately through support.

The welcome code is `WELCOME10`: 10% off the product subtotal, capped at $50. Shipping is $9 or free when the pre-discount subtotal is at least $150. These rules are shared by the bag and server checkout.

## Images and fonts

Sharper Creative Commons and public-domain replacements are stored locally under `client/public/images`. Product photography is representative, and those product pages are marked accordingly. Creator attribution, sources, licenses, and conversion details are recorded in [client/ASSETS.md](client/ASSETS.md) and the storefront’s `/credits` page. Self-hosted fonts include their SIL Open Font License files.

## Checks

```sh
cd client
npm run lint
npm test
npm run build
# With the app running on port 3004:
npm run check:api
# Creates and removes an isolated test database on the configured MongoDB cluster:
npm run check:integration
```

The HTTP smoke checks read the catalog and verify validation/access control without creating records or initiating payments. The integration checks start a separate app on port 3005 with a uniquely named test database, exercise authenticated customer and admin flows, then remove that test database. They cover account updates, server-priced orders, idempotency, stock restoration, order progression, product archiving, support messages, and newsletter deduplication. Neither suite charges a card. Cloudinary uploads and Stripe test payments can be reviewed separately with deliberate test data.

## Hosting

Set Vercel’s root directory to `client`, select Next.js, and configure the environment variables above in the project. The checked-in `client/vercel.json` specifies the framework and build commands. The app’s frontend and API run together; Render is not part of the app’s request path.

Administrators are existing database users with `role: "admin"`; the signup endpoint never grants administrator access.
