import User from '../models/userModel.js'; // Import User model
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
// import jwt from 'jsonwebtoken'; // Import jsonwebtoken for creating JWT
import { registerUserSchema,loginUserSchema } from '../validators/userValidator.js'; // Import user validation schema
import  redisClient  from '../services/redis.js'; // Import Redis client
import {generateToken} from '../utils/jwt.js'
import session from 'express-session';


// Function to handle user registration
export const registerUser = async  (req, res) => {
  try {
    // Validate the request body using a Joi schema (registerUserSchema)
    const { error } = registerUserSchema.validate(req.body);
    if (error) {
      // If validation fails, return a 400 response with the error message
      return res.status(400).json({ message: error.details[0].message });
    }


    const { name, email, password } = req.body;

    // Check if a user already exists with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists, return a 409 (Conflict) response
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the user's password using bcrypt before saving to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Handle profile picture upload
    const profilePicture = req.file ? req.file.buffer.toString('base64') : undefined;

    // Create a new user object with the hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePicture, // Add profile picture if provided
    });
    
    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token for the user. This token will be used for authentication in future requests
    const token = generateToken(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_KEY, // JWT secret key from the environment variables
    );

    // Set the JWT token in the response cookies for persistence (client-side)
    res.cookie('token', token, { httpOnly: true }); // Make the cookie accessible only via HTTP requests for security

    // Return the created user and JWT token in the response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePicture // Include profile picture in the response if available
      },
      token // Send the JWT token back to the client
    }); 
  } catch (err) {
    // If there's an error during registration, log the error and send a 500 response
    console.error('Error registering user:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

 // Function to handle user login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate the request body using a Joi schema (loginUserSchema)
    const { error } = loginUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token for the user
    const token = generateToken(
      { id: user._id, email: user.email },
      process.env.JWT_KEY,
    );

    // Set the JWT token in the response cookies for persistence (client-side)
    res.cookie('token', token, { httpOnly: true });

    // Return the logged-in user and JWT token in the response
    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token // Send the JWT token back to the client
    });

  } catch (err) {
    console.error('Error logging in user:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

 export const getUserProfile = async (req, res) => {
  try {
    // Get the user ID from the request object (set by isLoggedIn middleware)
    const userId = req.user._id;

    // Find the user in the database and exclude the password field from the response
    const user = await User.findById(userId).select('-password');

    
    // If user is not found, return a 404 response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's profile information in the response
    res.status(200).json({
      message: 'User profile retrieved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture ? user.profilePicture.toString('base64') : null
      }
    });
  } catch (err) {
    console.error('Error retrieving user profile:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
 }

 export const logoutUser = async (req, res) => {
  try {

    // Clear the JWT token from the cookies to log out the user
    const token = req.cookies.token|| req.headers.authorization?.split(' ')[1];


    if (token) {
       redisClient.set(token, 'logout', 'EX', 60 * 60 * 24); // Set the token in Redis with a TTL of 1 day
    }

    

    // Optionally, you can also invalidate the session on the server-side (if using sessions)
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
      }
      // Return a success message after logging out
      res.status(200).json({ message: 'User logged out successfully' });
    });
  } catch (err) {
    console.error('Error logging out user:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
 }

 export const getAllUsers = async (req, res) => {

  try {

    const prjUsers = req.body
    if (process.env.NODE_ENV === 'development') {
      console.log("User",prjUsers)
    }

    // const prjUsers = [req.user._id]
    // Find all users in the database and exclude the password field from the response
    const users = await User.find({
      _id: { $ne:req.user._id  } // Exclude the logged-in user from the list
    }).select('-password');

    // Return the list of users in the response
    res.status(200).json({
      message: 'All users retrieved successfully',
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email
      }))
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error retrieving all users:', err.message);
    }
    res.status(500).json({ message: 'Internal server error' });
  }

 }
