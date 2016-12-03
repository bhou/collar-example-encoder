class Decoder {
  decode(encoded) {
    return new Buffer(encoded, 'base64').toString('ascii');
  }
}


module.exports = Decoder;
