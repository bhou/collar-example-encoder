const collar = require('collar.js');

const ns = collar.ns('collar.example.encoder.lib', {author: 'util-team.Mike'});

const Encoder = require('./Encoder');
const Decoder = require('./Decoder');

const encoder = new Encoder();
const decoder = new Decoder();

function getEncoderProcessor() {
  return ns.map('encode the string', 
      {toBeEncoded: 'the string to be encoded'},
      {encoded: 'the encoded string'},
    s => {
      let input = s.get('toBeEncoded');
      if (!input) throw new Error('Bad Request');
      return s.set('encoded', encoder.encode(input));
    });
}

function getDecoderProcessor() {
  return ns.map('decode the string', 
      {toBeDecoded: 'the string to be decoded'},
      {decoded: 'the decoded string'},
    s => {
      let input = s.get('toBeDecoded');
      if (!input) throw new Error('Bad Request');
      return s.set('decoded', decoder.decode(input));
    });
}

module.exports = {
  getEncoderProcessor: getEncoderProcessor,
  getDecoderProcessor: getDecoderProcessor
}
