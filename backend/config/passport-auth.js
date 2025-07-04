// config/passport-config.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

// ===== Google Strategy =====
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.callbackURL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {

    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        profilePicture: profile.photos[0].value
      });
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// ===== GitHub Strategy =====
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.callbackURL}/auth/github/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log(profile);
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        githubId: profile.id
      });
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// ===== Session Handling =====
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
