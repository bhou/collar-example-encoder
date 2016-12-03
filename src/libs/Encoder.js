class Encoder {
  encode(content) {
    return new Buffer(content).toString('base64');
  }
}

module.exports = Encoder;
