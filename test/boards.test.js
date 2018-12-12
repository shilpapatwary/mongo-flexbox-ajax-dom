const request = require('supertest');
const chai = require('chai');
const mocha = require('mocha');
const app = require('../appServer');

const Boards = require('../model/boardModel');

let userCookie;

const should = chai.should();
function loginUser() {
  return request(app)
    .post('/auth/login')
    .type('form')
    .send({
      username: 'shilpa',
      password: 'shilpap',
    });
}

mocha.describe('Boards Application', () => {
  mocha.before((done) => {
    loginUser().then((response) => {
      userCookie = response.headers['set-cookie'];
      done();
    });
  });
  mocha.it('should retrieve all boards', () => {
    request(app)
      .get('/api/boards/')
      .set('Cookie', userCookie[0])
      .expect('content-type', /json/)
      .expect(200)
      .end((error, response) => {
        should.not.exist(error);
        should.exist(response);
      });
  });
  mocha.it('should retrieve a single board', () => {
    request(app)
      .get('/api/boards/5bdaeff0bee9dc6b70afed0d')
      .set('Cookie', userCookie[0])
      .expect('content-type', /json/)
      .expect(200)
      .end((error, response) => {
        should.not.exist(error);
        should.exist(response);
      });
  });
  mocha.it('should update a board', () => {
    const newBoard = {
      id: `${Math.floor(Math.random() * 100000)}`,
      name: 'board_old',
      lists: [],
    };
    const board = new Boards(newBoard);
    board.save((err, brd) => {
      request(app)
        .put(`/api/boards/${brd.id}`)
        .send({
          name: 'board10',
        })
        .set('Cookie', userCookie[0])
        .expect('content-type', /json/)
        .expect(200)
        .end((error, response) => {
          response.body.should.be.a('object');
          response.body.should.have.property('name').eql('board10 ');
          should.not.exist(error);
          should.exist(response);
        });
    });
  });
  mocha.it('should delete a board', () => {
    const newBoard = {
      id: `${Math.floor(Math.random() * 100000)}`,
      name: 'board_old',
      lists: [],
    };
    const board = new Boards(newBoard);
    board.save((err, brd) => {
      request(app)
        .delete(`/api/boards/${brd.id}`)
        .set('Cookie', userCookie[0])
        .expect('content-type', /json/)
        .expect(200)
        .end((error, response) => {
          response.body.should.be.a('object');
          should.not.exist(error);
          should.exist(response);
        });
    });
  });
  mocha.it('should create a board', () => {
    request(app)
      .post('/api/boards/')
      .send({
        id: `${Math.floor(Math.random() * 100000)}`,
        name: 'board_new_1',
        lists: [],
      })
      .set('Cookie', userCookie[0])
      .expect('content-type', /json/)
      .expect(200)
      .end((error, response) => {
        response.body.should.have.property('name');
        response.body.should.have.property('lists');
        should.not.exist(error);
        should.exist(response);
      });
  });
  mocha.it('should create a list in a board', () => {
    const newBoard = {
      id: `${Math.floor(Math.random() * 100000)}`,
      name: 'board_old',
      lists: [],
    };
    const board = new Boards(newBoard);
    board.save((err, brd) => {
      request(app)
        .put(`/api/boards/${brd.id}/lists`)
        .send({
          id: '12345',
          name: 'Alaska',
          closed: false,
          pos: 65535,
          cards: [],
        })
        .set('Cookie', userCookie[0])
        .expect('content-type', /json/)
        .expect(200)
        .end((error, response) => {
          should.not.exist(error);
          response.body.lists.length.should.not.be.eql(0);
          should.exist(response);
        });
    });
  });
  mocha.it('should create a card in a list', () => {
    request(app)
      .post('/api/boards/5bdaeff0bee9dc6b70afed0d/lists/560bf446f17023a3710658fb/cards')
      .send({
        id: '560bf4dd7139286471dc009c',
        name: 'Grand Canyon National Park',
        badges: {},
        labels: [],
      })
      .set('Cookie', userCookie[0])
      .expect('content-type', /json/)
      .expect(200)
      .end((error, response) => {
        should.not.exist(error);
        should.exist(response);
      });
  });
});
