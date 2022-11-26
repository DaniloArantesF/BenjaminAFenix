require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

let loggedIn = false;
if (fs.existsSync('tests/state.json')) {
  console.log('Found state. Checking that tokens are valid.');
  const state = require('./state.json');
  const { localStorage } = state['origins'].find(
    ({ origin }) => origin === 'http://localhost:3000'
  );
  const expiration = localStorage.find(
    ({ name }) => name == 'expiration'
  ).value;
  loggedIn = parseInt(expiration) > Date.now();
}

module.exports = {
  email: process.env.REACT_APP_TEST_EMAIL ?? '',
  password: process.env.REACT_APP_TEST_PASSWORD ?? '',
  loggedIn,
};
