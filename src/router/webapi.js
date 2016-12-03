const express = require('express');
const router = express.Router();

const authService = require('../service/authentication');
const subscriptionService = require('../service/subscription');

router.post('/register', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  authService.handleMsg({
    msg: 'register',
    username: username,
    password: password
  }, (error, result) => {
    if (error) {
      return res.status(error.statusCode || 500).json({msg: error.message});
    }
    return res.json(result);
  });
});

router.post('/login', (req, res) => {
  var session = req.session;
  let username = req.body.username;
  let password = req.body.password;
  authService.handleMsg({
    msg: 'authenticate',
    username: username,
    password: password
  }, (error, result) => {
    if (error) {
      return res.status(error.statusCode || 500).json({msg: error.message});
    }
    if (!session.user) session.user = {username: result.username};
    return res.json(result);
  })
});

router.get('/logout', (req, res) => {
  var session = req.session;
  if (session) session.destroy();

  res.redirect('/');
});

router.post('/subscribe', (req, res) => {
  let username = req.get('username');
  let password = req.get('password');
  let type = req.param.type || 'trial';
  subscriptionService.handleMsg({
    msg: 'subscribe',
    username: username,
    password: password,
    type: type
  }, (error, result) => {
    if (error) {
      return res.status(error.statusCode || 500).json({msg: error.message});
    }
    return res.json(result);
  });
})


module.exports = router;

