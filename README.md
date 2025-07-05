# 🚀 FusionAI: Collaborative MERN Stack Platform

FusionAI is a powerful full-stack collaboration platform designed to empower teams with real-time communication, collaborative code editing, and secure financial transactions. Built with the MERN (MongoDB, Express, React, Node.js) stack, it offers a comprehensive suite of features for modern web application development, especially those integrating AI.

---

## ✨ Features

* **Secure Authentication:** Users can sign in securely using **email/password (JWT + Bcrypt)**, **Google OAuth**, or **GitHub OAuth** (via Passport.js).
* **Real-time Collaboration:**
    * **Live Chat:** Communicate seamlessly with team members through integrated **Socket.io** real-time chat.
    * **Collaborative Code Editor:** Work together on code in a browser-based editor powered by **WebContainers**, supporting live editing and execution.
* **Robust Backend:**
    * **MongoDB:** Utilizes Mongoose for efficient NoSQL data storage.
    * **Redis:** Ensures high-performance session handling and caching.
    * **Joi:** Provides robust input validation for all user data.
* **Payment Integration:** Smooth and secure payment processing via **Razorpay**, supporting cards, UPI, net banking, and QR codes.
* **Dynamic Frontend:** A responsive and interactive user interface built with **React**.

---

## 🛠️ Tech Stack

| Technology      | Description                                  |
| :-------------- | :------------------------------------------- |
| **Node.js** | JavaScript runtime environment               |
| **Express.js** | Backend web application framework            |
| **MongoDB** | NoSQL database (managed with Mongoose)       |
| **React** | Frontend JavaScript library for UI           |
| **Socket.io** | Real-time bidirectional communication        |
| **Redis** | In-memory data store, cache, and message broker |
| **Razorpay** | Payment gateway for online transactions      |
| **Passport.js** | Authentication middleware for Node.js        |
| **Joi** | Schema description and data validation       |

---

## 📦 Key Dependencies

* `bcrypt`: Secure password hashing.
* `cookie-parser`: Parses HTTP cookies.
* `dotenv`: Loads environment variables from a `.env` file.
* `express`: Web application framework for Node.js.
* `express-session`: Session management for Express.
* `joi`: Data validation library.
* `jsonwebtoken`: Implements JSON Web Tokens for authentication.
* `mongoose`: MongoDB object modeling for Node.js.
* `passport`: Authentication middleware for Node.js.
* `passport-google-oauth20`: Passport strategy for authenticating with Google.
* `passport-github`: Passport strategy for authenticating with GitHub.
* `razorpay`: Official Node.js client for Razorpay API.
* `redis`: Node.js client for Redis.
* `socket.io`: Real-time, bidirectional, event-based communication.

---

## 📂 Project Structure
FusionAI/
├── backend/
│   ├── controllers/    → Business logic for API routes
│   ├── models/         → Mongoose schemas (database models)
│   ├── routes/         → Defines API endpoints and handlers
│   ├── middleware/     → Custom Express middleware functions
│   ├── utils/          → Helper utility functions
│   └── server.js       → Entry point for the backend server
└── frontend/
├── src/
│   ├── components/ → Reusable UI components
│   ├── pages/      → Application views/pages
│   ├── context/    → React Context API for global state
│   ├── hooks/      → Custom React hooks
│   └── App.jsx     → Main application component
├── public/         → Static assets (HTML, images, etc.)
└── vite.config.js  → Frontend build configuration (Vite)

---

## 🚀 Setup Instructions

Follow these steps to get FusionAI up and running on your local machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/Vishalbourne/FusionAI.git](https://github.com/Vishalbourne/FusionAI.git)
cd FusionAI
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
WEBHOOK_SECRET=your_webhook_secret

Start the Backend Server
node server.js
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env

VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

Start the frontend server:
npm run dev
```

## 🤝 Contributing
```bash
Fork the repository

Create a feature branch:
git checkout -b feature/YourFeature

Commit your changes:
git commit -m "Add YourFeature"

Push your branch:
git push origin feature/YourFeature

Open a Pull Request
```

## 📄 License
This project is licensed under the MIT License.


