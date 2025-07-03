// routes/authRoute.js

import express from 'express';
import passport from 'passport';
import { generateToken } from '../utils/jwt.js';
import User from '../models/userModel.js';

const router = express.Router();

// ===== Google Auth =====
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user;

    const token = generateToken(
      { id: user._id, email: user.email },
      process.env.JWT_KEY
    );

     res.cookie('token', token, { httpOnly: true });
    

     // assuming user.profilePicture is a Buffer
    const profilePicture = user.profilePicture?.toString("utf-8");


     const redirectUrl = `http://localhost:5173/oauth-success?token=${token}&id=${user._id}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&profilePicture=${encodeURIComponent(profilePicture)}`;

    res.redirect(redirectUrl);

  }
);

// ===== GitHub Auth =====
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user;

    const token = generateToken(
      { id: user._id, email: user.email },
      process.env.JWT_KEY
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.redirect(
  `http://localhost:5173/oauth-success?token=${token}`
);

  }
);


router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token invalid' });
  }
});



export default router;
