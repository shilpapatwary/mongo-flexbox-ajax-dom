/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
const debug = require('debug')('log');
const notes = require('../data/notes.json');
const Notes = require('../model/noteModel');

const notesController = {
  getAllNotes: (req, res, next) => {
    try {
      Notes.find((err, response) => {
        if (err) { return next(err); }
        if (req.query.sort_by === 'date') {
          const sortedNotes = [...response];
          sortedNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          res.set('Content-Type', 'application/json');
          res.status(200).send(sortedNotes);
        } else {
          res.set('Content-Type', 'application/json');
          res.status(200).send(response);
        }
      });
    } catch (e) {
      next(e);
    }
  },
  getNote: (req, res, next) => {
    try {
      const note = notes.filter(n => n.noteId === parseInt(req.params.id, 10));
      if (note.length === 0) res.status(404).send('Note not found!');
      else {
        res.set('Content-Type', 'application/json');
        res.status(200).send(note);
      }
    } catch (e) {
      next(e);
    }
  },
  createNote: (req, res, next) => {
    try {
      const note = new Notes({
        noteId: req.body.noteId,
        noteTitle: req.body.noteTitle,
        noteDescription: req.body.noteDescription,
        createdAt: req.body.createdAt,
      });
      note.save((err) => {
        if (err) {
          return next(err);
        }
        res.set('Content-Type', 'application/json');
        res.status(201).send(note);
      });
    } catch (e) {
      next(e);
    }
  },
  updateNote: (req, res, next) => {
    try {
      const options = { new: true };
      const update = { $set: req.body };
      Notes.findOneAndUpdate({ noteId: req.params.id }, update, options, (err, note) => {
        if (err) { return next(err); }
        res.set('Content-Type', 'application/json');
        res.status(202).send(note);
      });
    } catch (e) {
      debug(e);
      next(e);
    }
  },
  deleteNote: (req, res, next) => {
    try {
      Notes.findOneAndDelete({ noteId: req.params.id }, (err, note) => {
        if (err) { return next(err); }
        res.set('Content-Type', 'application/json');
        res.set(200).send(note);
      });
    } catch (e) {
      next(e);
    }
  },
};

module.exports = notesController;
