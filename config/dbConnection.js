const debug = require('debug')('log');
const mongoose = require('mongoose');

const devDbUrl = 'mongodb://localhost:27017/myappdb';
// const mongoURI = process.env.MONGOLAB_URI || devDbUrl;

mongoose.connect(devDbUrl, (err) => {
  if (err) {
    throw (err);
  } else {
    debug('connected to DB!');
  }
});

module.exports = mongoose;
