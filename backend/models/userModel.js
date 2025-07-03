import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    minlength: [3, 'Password must be at least 3 characters long']
  },
  googleId: {
    type: String,
    unique: true, // Make sure the googleId is unique
    sparse: true,  // Allows this field to be optional for non-Google users
  },
  profilePicture: {
    type: Buffer,
    default: 'https://via.placeholder.com/120', // Default profile picture URL
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
export default User;
