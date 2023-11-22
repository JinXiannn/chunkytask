const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/User');

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use(new GoogleStrategy(
  {
    clientID: 'your-google-client-id',
    clientSecret: 'your-google-client-secret',
    callbackURL: 'your-google-callback-url',
  },
  (accessToken, refreshToken, profile, done) => {
    // Implement Google authentication logic (create or retrieve user)
    // Call done(null, user) if authentication is successful
  }
));

passport.use(new FacebookStrategy(
  {
    clientID: 'your-facebook-client-id',
    clientSecret: 'your-facebook-client-secret',
    callbackURL: 'your-facebook-callback-url',
  },
  (accessToken, refreshToken, profile, done) => {
    // Implement Facebook authentication logic (create or retrieve user)
    // Call done(null, user) if authentication is successful
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

