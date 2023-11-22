const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Assuming you have a User model

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://atlas-sql-655b48b35708df408fa5b3cf-hx298.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: 'rextiew200456',  // Replace with your MongoDB username
  pass: 'Okaka69',  // Add your MongoDB password
  dbName: 'Cluster0'  // Add your MongoDB database name
});

// Middleware
app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy for username/password
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: 'Invalid username or password' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Google authentication strategy
passport.use(new GoogleStrategy({
  clientID: 'your-google-client-id',
  clientSecret: 'your-google-client-secret',
  callbackURL: 'your-google-callback-url',
}, (accessToken, refreshToken, profile, done) => {
  // Implement Google authentication logic (create or retrieve user)
  // Call done(null, user) if authentication is successful
}));

// Facebook authentication strategy
passport.use(new FacebookStrategy({
  clientID: 'your-facebook-client-id',
  clientSecret: 'your-facebook-client-secret',
  callbackURL: 'your-facebook-callback-url',
}, (accessToken, refreshToken, profile, done) => {
  // Implement Facebook authentication logic (create or retrieve user)
  // Call done(null, user) if authentication is successful
}));

// Serialize and deserialize user (for session management)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
