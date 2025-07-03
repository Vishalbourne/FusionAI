import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import redisClient from '../services/redis.js';

// Middleware to check if user is logged in
export const isLoggedIn = async (req, res, next) => {
  try {
    // Get token from cookies or headers
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];


    // console.log('Token:', token); // Debugging line to check the token value


    // If no token, user is not authenticated
    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Check if the token is blacklisted
    const isBlacklisted = await redisClient.get(token);
    if (isBlacklisted) {
      res.clearCookie('token'); // Clear the cookie containing the JWT token
      return res.status(401).json({ message: 'Unauthorized: Token is blacklisted' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // console.log('Decoded Token:', decoded); // Debugging line to check the decoded token

    // Fetch user from database using decoded token
    const user = await User.findById(decoded.id).select('-password'); // Exclude password field

    // console.log('User:', user); // Debugging line to check the user object

    // If no user found
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found',redirectToLogin: true });
    }

    // Attach user to request object
    req.user = user;

    next(); // Proceed to the next middleware or route
  } catch (error) {
    // Handle token errors (invalid, expired, etc.)
    if (process.env.NODE_ENV === 'development') {
      console.error('Auth Middleware Error:', error.message);
    }

    return res.status(401).json({ message: 'Unauthorized: Invalid token',redirectToLogin: true });
  }
};
