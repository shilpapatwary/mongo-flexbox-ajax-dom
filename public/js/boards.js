/* eslint-disable no-unused-expressions */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
class Boards {
  constructor() {
    this.init();
  }

  init() {
    this.bindings();
  }

  service(options) {
    fetch(options.url, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: options.body,
      credentials: 'include',
    }).then(res => res.json())
      .then((data) => {
        options.callback(data);
      }).catch((err) => {
        console.log(err);
      });
  }

  renderViewService(options) {
    fetch(options.url, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: options.body,
      credentials: 'include',
    }).then(res => res.text())
      .then((data) => {
        options.callback(data);
      }).catch((err) => {
        debug(err);
      });
  }

  createboard(data) {
    const markup = `<li class="board" id="${data.id}">
      <form id="boardUpdate${data.id}">
       <div class="boardHeader">
          <input type="text" id="boardTitle${data.id}" class="boardTitle" value="${data.name}"/>
          <span id="update${data.id}" class="updateboard">&#10003;</span>
          <span class="deleteboard">X</span>
       </div><div class="boardBody">
      </form>
  </li>`;
    return markup;
  }

  insertMarkup(markup) {
    document.getElementById('boardsContainer').insertAdjacentHTML('beforeend', markup);
  }

  addboardToList(data) {
    this.insertMarkup(this.createboard(data));
    this.bindings();
  }

  displayboards(boards) {
    const boardsMarkup = [];
    boards.forEach((board) => {
      boardsMarkup.push(this.createboard(board));
    });
    this.insertMarkup(boardsMarkup.join(''));
    this.bindings();
  }

  showAllboards() {
    const options = {
      url: '/api/boards',
      method: 'get',
      credentials: 'include',
      callback: this.displayboards.bind(this),
    };
    this.service(options);
  }

  addboard() {
    const boardData = JSON.stringify({
      id: Math.floor(Math.random() * 100000),
      name: 'My board',
      lists: [],
    });
    const options = {
      url: '/api/boards',
      method: 'post',
      body: boardData,
      credentials: 'include',
      callback: this.addboardToList.bind(this),
    };
    this.service(options);
  }

  deleteFromList(board) {
    const elem = document.getElementById(board.id);
    document.getElementById('boardsContainer').removeChild(elem);
  }

  deleteboard(elem) {
    const boardId = elem.closest('.board').id;
    const options = {
      url: `/api/boards/${boardId}`,
      method: 'delete',
      credentials: 'include',
      callback: this.deleteFromList.bind(this),
    };
    this.service(options);
  }

  updateToList(data) {
    document.getElementById(`update${data.id}`).classList.add('success');
    setTimeout(() => {
      document.getElementById(`update${data.id}`).classList.remove('success');
    }, 2000);
  }

  updateboard(elem) {
    const boardId = elem.closest('.board').id;
    const title = document.getElementById(`boardTitle${boardId}`).value;
    const updatedboard = {
      name: title,
    };
    const options = {
      url: `/api/boards/${boardId}`,
      method: 'put',
      body: JSON.stringify(updatedboard),
      credentials: 'include',
      callback: this.updateToList.bind(this),
    };
    this.service(options);
  }

  toggleBoards(flag) {
    const boards = document.getElementById('boards');
    const addBoardIcon = document.getElementById('createBoardIcon');
    flag ? boards.classList.add('hidden') : boards.classList.remove('hidden');
    flag ? addBoardIcon.classList.add('hidden') : addBoardIcon.classList.remove('hidden');
  }

  toggleLists(flag) {
    const lists = document.getElementById('Lists');
    flag ? lists.classList.add('hidden') : lists.classList.remove('hidden');
  }

  displayLists(data) {
    this.toggleBoards(true);
    document.getElementById('content').insertAdjacentHTML('beforeend', data);
    this.bindings();
  }

  openBoard(elem) {
    const boardId = elem.closest('.board').id;
    const options = {
      url: `/api/boards/${boardId}`,
      method: 'get',
      credentials: 'include',
      callback: this.displayLists.bind(this),
    };
    this.renderViewService(options);
  }

  addLists(elem) {
    const boardId = elem.closest('.listSection').id;
    const updatedboard = {
      name: document.getElementById('listTitle').value,
      cards: [],
    };
    const options = {
      url: `/api/boards/${boardId}/lists`,
      method: 'put',
      body: JSON.stringify(updatedboard),
      credentials: 'include',
      callback: this.displayLists.bind(this),
    };
    this.service(options);
  }

  addCard(elem) {
    const listId = elem.closest('.list').id;
    const boardId = elem.closest('.listSection').id;
    const updatedboard = {
      name: 'sample card',
    };
    const options = {
      url: `/api/boards/${boardId}/lists/${listId}/cards`,
      method: 'put',
      body: JSON.stringify(updatedboard),
      credentials: 'include',
      callback: this.displayLists.bind(this),
    };
    this.service(options);
  }

  bindings() {
    document.getElementById('createBoardIcon').addEventListener('click', (event) => {
      event.stopImmediatePropagation();
      this.addboard();
    });
    Array.from(document.getElementsByClassName('deleteboard'), c => c.addEventListener('click', (event) => {
      event.stopImmediatePropagation();
      this.deleteboard(event.currentTarget);
    }));
    Array.from(document.getElementsByClassName('updateboard'), c => c.addEventListener('click', (event) => {
      this.updateboard(event.currentTarget);
    }));
    Array.from(document.getElementsByClassName('boardBody'), c => c.addEventListener('click', (event) => {
      event.stopImmediatePropagation();
      this.openBoard(event.currentTarget);
    }));
    if (document.getElementById('linkBoards')) {
      document.getElementById('linkBoards').addEventListener('click', () => {
        this.toggleBoards(false);
        this.toggleLists(true);
      });
      document.querySelector('.addList').addEventListener('click', () => {
        document.getElementById('addListForm').classList.remove('hidden');
      });
      document.querySelector('.listSubmit').addEventListener('click', (event) => {
        event.preventDefault();
        this.addLists(event.currentTarget);
      });
      Array.from(document.getElementsByClassName('addCard'), c => c.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        this.addCard(event.currentTarget);
      }));
    }
    window.addEventListener('load', () => {
      this.showAllboards();
    });
  }
}
// eslint-disable-next-line no-new
new Boards();
