/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
const Boards = require('../model/boardModel');

const boardsController = {
  getAllBoards: (req, res, next) => {
    try {
      Boards.find((err, response) => {
        if (err) { return next(err); }
        res.set('Content-Type', 'application/json');
        res.status(200).send(response);
      });
    } catch (e) {
      next(e);
    }
  },
  getBoard: (req, res, next) => {
    try {
      Boards.findOne({ id: req.params.id }, (err, response) => {
        if (err) { return next(err); }
        res.set('Content-Type', 'text/html');
        res.status(200);
        res.render('list', response);
      });
    } catch (e) {
      next(e);
    }
  },
  updateBoard: (req, res, next) => {
    try {
      const options = { new: true };
      const update = { $set: req.body };
      Boards.findOneAndUpdate({ id: req.params.id }, update, options, (err, board) => {
        if (err) { return next(err); }
        res.set('Content-Type', 'application/json');
        res.status(202).send(board);
      });
    } catch (e) {
      next(e);
    }
  },
  deleteBoard: (req, res, next) => {
    try {
      Boards.findOneAndDelete({ id: req.params.id }, (err, board) => {
        if (err) { return next(err); }
        res.set('Content-Type', 'application/json');
        res.set(200).send(board);
      });
    } catch (e) {
      next(e);
    }
  },
  createBoard: (req, res, next) => {
    try {
      const board = new Boards({
        id: req.body.id,
        name: req.body.name,
        lists: req.body.lists,
      });
      board.save((err) => {
        if (err) {
          return next(err);
        }
        res.set('Content-Type', 'application/json');
        res.status(201).send(board);
      });
    } catch (e) {
      next(e);
    }
  },
  createListInBoard: (req, res, next) => {
    try {
      const options = { new: true };
      const list = req.body;
      list.id = `${Math.floor(Math.random() * 100000)}`;
      const update = { $push: { lists: list } };
      Boards.findOneAndUpdate({ id: req.params.id }, update, options, (err, board) => {
        if (err) { return next(err); }
        res.set('Content-Type', 'text/html');
        res.status(200);
        res.render('list', board);
      });
    } catch (e) {
      next(e);
    }
  },
  createCardInList: (req, res, next) => {
    try {
      const card = req.body;
      const options = { new: true };
      card.id = `${Math.floor(Math.random() * 100000)}`;
      const boardId = req.params.bid;
      const listId = req.params.lid;
      const update = { $push: { 'lists.$.cards': card } };
      Boards.findOneAndUpdate({ id: boardId, 'lists[id]': listId }, update, options, (err, board) => {
        if (err) { return next(err); }
        res.set('Content-Type', 'text/html');
        res.status(200);
        res.render('list', board);
      });
    } catch (e) {
      next(e);
    }
  },
};

module.exports = boardsController;
