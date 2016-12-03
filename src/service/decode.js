const lib = require('../libs');
const Usage = require('../libs/db/Usage');


/* import other services */
const authentication = require('./authentication');
const subscription = require('./subscription');

const collar = require('collar.js');
const ns = collar.ns('collar.example.encoder.service.decode', {
  arch: 'decode',
  author: 'service-team.Kevin'
});

const input = ns.input('decode service input');
const output = ns.output('decode service output');

input
  .when('"decode" event', {msg: 'must be "decode"'},
    s => s.get('msg') === 'decode')
  .map('validate input', {toBeDecoded: 'the string to be decoded (must exist)'}, s => {
    if (!s.get('toBeDecoded')) {
      let error = new Error('Bad Request'); 
      error.statusCode = 400;
      throw error;
    }
    return s;
  })
  .map('prepare authentication', s => s.set('msg', 'authenticate'))
  .through('authenticate', authentication.input, authentication.output, true)
  .map('prepare get subscription msg', s => {
    return s.set('msg', 'get subscription');
  })
  .through('get subscribption', subscription.input, subscription.output, true)
  .do('check usage', s => {
    let usage = Usage.findDailyUsageByUserName(s.get('username'));
    console.log(usage);
    if (usage && usage.length >= s.getResult().subscription.capacity) {
      let error = new Error('Exceed capacity limit!')
      error.statusCode = 403;
      throw error;
    }
  })
  .through('decode', lib.getDecoderProcessor())
  .do('record usage', s => {
    let usage = new Usage(s.get('username'), 'encode', new Date().getTime());
    usage.save();
  })
  .map('prepare "result" message', {}, {
      msg: 'decoded',
      decoded: 'the decoded string'
    }, s => {
    return s.new({
      msg: 'decoded',
      decoded: s.get('decoded')
    })
  })
  .errors((s, rethrow) => {
    console.error(s.error);
    rethrow(s);
  })
  .to(output);

module.exports = {
  input: input,
  output: output,
  handleMsg: collar.toNode(input, output)
}
