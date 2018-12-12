/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
const debug = require('debug')('log');
const Channels = require('../model/channelModel');

const channelsController = {
  getAllchannels: (req, res, next) => {
    try {
      Channels.find((err, response) => {
        if (err) { return next(err); }
        res.set('Content-Type', 'application/json');
        res.status(200).send(response);
      });
    } catch (e) {
      next(e);
    }
  },
  updatechannel: (req, res, next) => {
    try {
      const options = { new: true };
      const update = { $push: { messages: req.body } };
      Channels.findOneAndUpdate({ id: req.params.id }, update, options, (err, channel) => {
        if (err) { return next(err); }
        res.set('Content-Type', 'application/json');
        res.status(202).send(channel);
      });
    } catch (e) {
      next(e);
    }
  },
  getChannel: (req, res, next) => {
    try {
      Channels.findOne({ id: req.params.id }, (err, response) => {
        if (err) { return next(err); }
        res.set('Content-Type', 'application/json');
        debug(response);
        res.status(200).send(response);
      });
    } catch (e) {
      debug(e);
      next(e);
    }
  },
};

module.exports = channelsController;
