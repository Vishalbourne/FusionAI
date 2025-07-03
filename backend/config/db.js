import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors"; // Import colors for colored console output

colors.enable(); // Enable colors for terminal output
dotenv.config(); // Load environment variables from .env file

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to the MongoDB database using Mongoose
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // Check if the environment is development
    if (process.env.NODE_ENV === 'development') {
      // Log success message with cyan color and underline (only in development mode)
      console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    }
  } catch (error) {
    // If an error occurs during connection, log the error with red color and bold
    console.error(`Error: ${error.message}`.red.bold);
    
    // Exit the process with failure code 1
    process.exit(1);
  }
};

export default connectDB;
