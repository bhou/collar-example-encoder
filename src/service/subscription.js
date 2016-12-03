const Subscription = require('../libs/db/Subscription');


/* import other services */
const authentication = require('./authentication');


const collar = require('collar.js');
const ns = collar.ns('collar.example.encoder.service.subscription', {
  arch: 'subscription',
  author: 'it-team.Paul'
});

const input = ns.input('subscription input');
const output = ns.output('subscription output');


const authenticatedInput = input
  .map('prepare authentication msg', s => {
    return s.set('_msg_', s.get('msg')).set('msg', 'authenticate');
  })
  .through('authenticate', authentication.input, authentication.output, true)
  .map('recover msg', s => {
    return s.set('msg', s.get('_msg_')).del('_msg_');
  });

const errorHandler = ns.errors((s, rethrow) => {
  console.error(s.error);
  rethrow(s);
});

errorHandler.to(output);



authenticatedInput
  .when('subscribe', s => s.get('msg') === 'subscribe')
  .map('validate input', s => {
    let type = s.get('type');
    let username = s.get('username');

    if (!type || !username) {
      let error = new Error('Bad Request! Must have subscription "type" and "username"');
      error.statusCode = 400;
      throw error;
    }
    return s;
  })
  .do('find subscription by name', s => {
    let username = s.get('username');

    let sub = Subscription.findSubscriptionByUserName(username);
    if (sub) {
      let error = new Error('Subscription already exists!');
      error.statusCode = 400;
      throw error;
    }
  })
  .do('subscribe', s => {
    let sub = new Subscription(s.get('username'), s.get('type'));
    sub.save();
  })
  .map('prepare "new subscription" msg', s => {
    return s.new({
      msg: 'new subscription',
      username: s.get('username'),
      type: s.get('type')
    })
  })
  .to(errorHandler);


authenticatedInput
  .when('get subscription', {msg: 'must be "get subscription"'}, s => s.get('msg') === 'get subscription')
  .map('validate input', {username: 'the username'}, s => {
    let username = s.get('username');
    if (!username) {
      let error = new Error('Bad Request');
      error.statusCode = 400;
      throw error;
    }
    return s;
  })
  .do('find subscription by user name', s => {
    let username = s.get('username');
    let sub = Subscription.findSubscriptionByUserName(username);
    if (!sub) {
      let error = new Error('No Subscription Found');
      error.statusCode = 404;
      throw error;
    }
    console.log(sub.toJSON());
    return sub.toJSON();
  })
  .map('prepare "subscription" msg', s => {
    return s.new({
      msg: 'subscription',
      username: s.get('username'),
      subscription: s.getResult()
    })
  })
  .to(errorHandler);

module.exports = {
  input,
  output,
  handleMsg: collar.toNode(input, output)
}

