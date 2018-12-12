const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const session = require('express-session');
const jsonServer = require('json-server');
const path = require('path');

require('./config/dbConnection');

const notesRouter = require('./routes/notes');
const boardsRouter = require('./routes/boards');
const workspacesRouter = require('./routes/workspaces');
const channelsRouter = require('./routes/channels');
const userRouter = require('./routes/user');
const passport = require('./authenticate');
const homeRouter = require('./routes/home');

const app = express();
const port = process.env.PORT || 3000;

const jsonRoutes = jsonServer.router(path.resolve(__dirname, 'boards.json'));
const jsonMiddlewares = jsonServer.defaults();

app.use('/api/docs/', jsonRoutes);
app.use('/api/docs/', jsonMiddlewares);

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({
  extended: true,
}));
app.use(bodyparser.json());
app.use(session({
  secret: 'shilpa',
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', homeRouter);
app.use('/auth', userRouter);
app.use('/api/notes', notesRouter);
app.use('/api/boards', boardsRouter);
app.use('/api/workspaces', workspacesRouter);
app.use('/api/channels', channelsRouter);

app.use((err, req, res, next) => {
  if (err) res.set(500).send('Some error occured, Please try again later!');
  next();
});
app.use((req, res) => {
  res.set(404).send('REQUEST NOT FOUND');
});

app.listen(port, () => {});

module.exports = app;
