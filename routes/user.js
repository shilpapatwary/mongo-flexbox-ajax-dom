const express = require('express');
const path = require('path');
const User = require('../model/userModel');
const passport = require('../authenticate');

const router = express.Router();

router.route('/login').get((req, res, next) => {
  try {
    res.set('Content-Type', 'text/html');
    res.status(201).sendFile(path.join(__dirname, '../public/views/login.html'));
  } catch (e) {
    next(e);
  }
}).post(passport.authenticate('local'), (req, res) => {
  res.send('You are logged in');
});

router.route('/register').get((req, res, next) => {
  try {
    res.set('Content-Type', 'text/html');
    res.status(201).sendFile(path.join(__dirname, '../public/views/register.html'));
  } catch (e) {
    next(e);
  }
}).post((req, res, next) => {
  try {
    const newUser = new User({ username: req.body.username, password: req.body.password });
    newUser.save((err) => {
      if (err) {
        throw err;
      } else {
        res.set('Content-Type', 'text/html');
        res.status(201).send('You have registered successfully!');
      }
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
