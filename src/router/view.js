const express = require('express');
const router = express.Router();

function getCommonRenderData(req) {
  var session = req.session;
  return {
    user: session.user
  }
}

router.get('/', (req, res) => {
  var data = getCommonRenderData(req);  
  res.render('index', data);
});

router.get('/pricing', (req, res) => {
  var data = getCommonRenderData(req);
  res.render('pricing', data);
});

router.get('/login', (req, res) => {
  var data = getCommonRenderData(req);
  if (data.user) return res.redirect('/');
  res.render('login', data);
});

router.get('/register', (req, res) => {
  var data = getCommonRenderData(req);
  res.render('register', data);
});

router.get('/profile', (req, res) => {
  var data = getCommonRenderData(req);
  res.render('profile', data);
});

module.exports = router;
