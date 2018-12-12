/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
/* eslint-disable no-new */
class Home {
  constructor() {
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

  textService(options) {
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
        console.log(err);
      });
  }

  showForm(response) {
    document.getElementById('form').classList.remove('hidden');
    document.getElementById('success').classList.add('hidden');
    document.getElementById('form').innerHTML = response;
    this.bindings();
  }

  showSuccess(response) {
    document.getElementById('form').classList.add('hidden');
    document.getElementById('success').innerHTML = `<span>${response.message}</span>`;
    document.getElementById('success').classList.remove('hidden');
  }

  bindings() {
    document.getElementById('login').addEventListener('click', () => {
      this.textService({
        url: '/auth/login',
        method: 'GET',
        callback: this.showForm.bind(this),
      });
    });
    document.getElementById('register').addEventListener('click', () => {
      this.textService({
        url: '/auth/register',
        method: 'GET',
        callback: this.showForm.bind(this),
      });
    });
    if (document.getElementById('submitLogin')) {
      document.getElementById('loginForm').addEventListener('submit', (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        this.service({
          url: '/auth/login',
          method: 'POST',
          body: JSON.stringify({
            username: event.currentTarget.elements.username.value,
            password: event.currentTarget.elements.password.value,
          }),
          callback: this.showSuccess.bind(this),
        });
      });
    }

    if (document.getElementById('submitRegister')) {
      document.getElementById('registrationForm').addEventListener('submit', (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        const username = event.currentTarget.elements.username.value;
        const password = event.currentTarget.elements.password.value;
        if (username !== null && password !== null) {
          this.service({
            url: '/auth/register',
            method: 'POST',
            body: JSON.stringify({
              username: event.currentTarget.elements.username.value,
              password: event.currentTarget.elements.password.value,
            }),
            callback: this.showSuccess.bind(this),
          });
        }
      });
    }
  }
}
new Home();
