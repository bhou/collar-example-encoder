const User = require('../libs/db/User');

const collar = require('collar.js');
const ns = collar.ns('collar.example.encoder.service.auth', {
  arch: 'authentication', 
  author: 'it-team.Susan'
});

const input = ns.input('auth input');
const output = ns.output('auth output');

// define the common tail pipeline
const errorHandler = ns.errors((s, rethrow) => {
  console.error(s.error);
  rethrow(s);
});
errorHandler.to(output);


input
  .when('register', {msg: 'must be "register"'}, s => s.get('msg') === 'register')
  .map('validate input', {username: 'user name', password: 'password'}, s => {
    let username = s.get('username');
    let password = s.get('password');
    if (!username || !password) {
      let error = new Error('Bad Request! Must have "username" and "password" in request');
      error.statusCode = 400;
      throw error;
    }
    return s;
  })
  .do('find user by name', {username: 'username'}, {error: 'if user exists'}, s => {
    let user = User.findUserByName(s.get('username'));
    if (user) {
      let error = new Error('User already exists!');
      error.statusCode = 400;
      throw error;
    }
  })
  .do('store user information', s => {
    let username = s.get('username');
    let password = s.get('password');

    new User(username, password).save();
  })
  .map('prepare [registered] msg', s => {
    return s.new({
      msg: 'registered',
      username: s.get('username')
    })
  })
  .to(errorHandler);

input
  .when('authenticate', {msg: 'must be "authenticate"'}, s => s.get('msg') === 'authenticate')
  .map('validate input', s => {
    let username = s.get('username');
    let password = s.get('password');
    if (!username || !password) {
      let error = new Error('Must have "username" and "password" in request');
      error.statusCode = 400;
      throw error;
    }
    return s;
  })
  .do('find user from DB', s => {
    let user = User.findUserByName(s.get('username'));
    if (!user) {
      let error = new Error('User Not Found!');
      error.statusCode = 404;
      throw error;
    }
    return user.toJSON();
  })
  .do('check username and password', s => {
    let password = s.get('password');
    let user = s.getResult();

    if (password !== user.password) {
      let error = new Error('Username and password not match!');
      error.statusCode = 401;
      throw error;
    }
  })
  .map('prepare [authenticated] msg', s => {
    return s.new({
      msg: 'authenticated',
      username: s.get('username')
    })
  })
  .to(errorHandler);


  module.exports = {
    input,
    output,
    handleMsg: collar.toNode(input, output)
  }
