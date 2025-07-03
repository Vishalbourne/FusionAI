import express from 'express';
import upload from '../config/multer-config.js';
import {registerUser,loginUser,getUserProfile,logoutUser,getAllUsers} from '../controllers/userController.js';
import { isLoggedIn } from '../middleware/isLoggedIn.js'; 

const router = express.Router();

router.post('/register', upload.single('profilePicture'),registerUser);

router.post('/login',loginUser);

router.get('/profile', isLoggedIn, getUserProfile);

router.get('/logout',isLoggedIn,logoutUser);

router.get('/all', isLoggedIn, getAllUsers);

export default router;