# 🛒 Exclusive - Full-Stack E-Commerce Platform

![Exclusive E-Commerce Banner](https://via.placeholder.com/1200x400/000000/FFFFFF/?text=Exclusive+E-Commerce+Platform)

**Exclusive** is a production-ready, full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application. It features a complete shopping lifecycle, secure credit card processing via Stripe, role-based authentication, and a dedicated administrative dashboard for inventory and order management.

### 🔗 Live Links
* **Live Application:** [Visit Exclusive E-Commerce](https://exclusive-ecommerce-mu.vercel.app/)
* **Backend API:** Hosted on Render

---

## ✨ Key Features

### 🛍️ Customer Experience
* **Dynamic Shopping Cart:** Global state management for seamless adding, updating, and removing of products.
* **Secure Checkout System:** Integrated with **Stripe** for simulated, secure credit card transactions, alongside a custom "Cash on Delivery" pipeline.
* **Authentication:** JWT-based secure login and registration system.
* **Responsive Design:** A mobile-first, highly responsive UI built with Tailwind CSS.

### 🛡️ Admin Control Panel
* **Role-Based Access Control (RBAC):** Protected routes ensuring only authorized users can access the dashboard.
* **Order Management:** Real-time visibility into customer orders with the ability to dynamically update fulfillment statuses (Pending, Shipped, Delivered).
* **Live Inventory Uploads:** Integrated with the **ImgBB API** allowing administrators to upload product images directly from their local machines to the cloud, automatically syncing the generated URLs to the MongoDB database.

---

## 💻 Tech Stack

**Frontend (Client)**
* **React.js** (via Vite for optimized build speeds)
* **Tailwind CSS** (for utility-first, responsive styling)
* **React Router DOM** (for seamless SPA navigation)
* **Stripe React Elements** (for secure UI payment inputs)

**Backend (Server)**
* **Node.js & Express.js** (RESTful API architecture)
* **MongoDB & Mongoose** (NoSQL database and schema modeling)
* **JSON Web Tokens (JWT)** (for stateless, secure authentication)
* **Stripe Node API** (for backend payment intents)

**Third-Party Integrations**
* **Stripe API:** Payment processing
* **ImgBB API:** Cloud image hosting

---

## 🚀 Installation & Local Development

Want to run this project locally? Follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/islamrakibul9274/exclusive-ecommerce.git](https://github.com/islamrakibul9274/exclusive-ecommerce.git)
cd exclusive-ecommerce


2. Set up the Backend
Bash
cd server
npm install
Create a .env file in the server directory and add your keys:

Code snippet
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_code
STRIPE_SECRET_KEY=your_stripe_secret_key
Start the backend server:

Bash
npm start
3. Set up the Frontend
Open a new terminal window:

Bash
cd client
npm install --legacy-peer-deps
Navigate to client/src/pages/CheckOut.jsx and insert your Stripe Publishable Key:

JavaScript
const stripePromise = loadStripe('your_stripe_publishable_key');
Start the frontend development server:

Bash
npm run dev
📈 Architecture & Deployment
Monorepo Structure: Both client and server reside in a single repository for streamlined version control.

Frontend Hosting: Deployed on Vercel with optimized build caching.

Backend Hosting: Deployed as a web service on Render, featuring automatic environment variable injection and secure port mapping.

Built with ❤️ by Rakibul Islam Rumel