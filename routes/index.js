const express = require('express');
const passport = require('passport');

const router = express.Router();

// Dashboard route (protected by authentication)
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.send('Dashboard - Welcome, ' + req.user.username);
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res,
