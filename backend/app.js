import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from './config/passport-auth.js'; // Google OAuth strategy
import connectDB from './config/db.js';

import userRoute from './routes/userRoute.js'; // Routes for user CRUD actions
import authRoute from './routes/authRoute.js'; // Routes for authentication
import messageRoute from './routes/messageRoute.js'; // Routes for message CRUD actions
import projectRoute from './routes/projectRoute.js'; // Routes for project CRUD actions
import paymentRoute from './routes/paymentRoute.js'; // Routes for payment processing

// Load environment variables from .env
dotenv.config();

// Initialize DB connection
connectDB();

// Create Express app
const app = express();

// ----------------- MIDDLEWARES ------------------ //

// Logger middleware (for dev/debugging)
app.use(morgan('dev'));

// Allow cross-origin requests
app.use(cors({
  origin:"http://localhost:5173",
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.set('view engine', 'ejs'); // Set EJS as the view engine

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public')); // Serve static files from 'public' directory

// Parse cookies from incoming requests
app.use(cookieParser());

// Configure session storage
app.use(session({
  secret: process.env.SESSION_SECRET,  // Should be a strong, secure key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize passport and enable session support
app.use(passport.initialize());
app.use(passport.session());

// ----------------- ROUTES ------------------ //

// All user-related routes (profile, update, delete, etc.)
app.use('/api/users', userRoute);

// All auth-related routes (Google login, logout, etc.)
app.use('/auth', authRoute);


// All project-related routes (CRUD operations for projects)
app.use('/api/projects', projectRoute);

// All message-related routes (CRUD operations for messages)
app.use('/api/messages', messageRoute);

// All payment-related routes (razorpay integration, payment processing)
app.use('/api/payments', paymentRoute);

// ----------------- DEFAULT ROUTE ------------------ //
app.get('/', (req, res) => {
  res.render('payment');
});

export default app;
