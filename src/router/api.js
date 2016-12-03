const express = require('express');
const router = express.Router();

const authService = require('../service/authentication');
const subscriptionService = require('../service/subscription');
const encodeService = require('../service/encode');
const decodeService = require('../service/decode');

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
  })
});

router.post('/login', (req, res) => {
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
    return res.json(result);
  })
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

router.post('/encode', (req, res) => {
  let toBeEncoded = req.body.msg;
  let username = req.get('username');
  let password = req.get('password');
  encodeService.handleMsg({
    msg: 'encode',
    username: username,
    password: password,
    toBeEncoded: toBeEncoded
  }, (error, result) => {
    if (error) {
      return res.status(error.statusCode || 500).json({msg: error.message});
    }
    return res.json(result);
  })
});

router.post('/decode', (req, res) => {
  let toBeDecoded = req.body.msg;
  let username = req.get('username');
  let password = req.get('password');
  decodeService.handleMsg({
    msg: 'decode',
    username: username,
    password: password,
    toBeDecoded: toBeDecoded
  }, (error, result) => {
    if (error) {
      return res.status(error.statusCode || 500).json({msg: error.message});
    }
    return res.json(result);
  })
});

module.exports = router;
