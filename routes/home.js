const express = require('express');
const path = require('path');

const router = express.Router();

router.route('/').get((req, res, next) => {
  try {
    res.set('Content-Type', 'text/html');
    res.status(201).sendFile(path.join(__dirname, '../public/home.html'));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
