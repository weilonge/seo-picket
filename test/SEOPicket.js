const Picket = require('../src/seo-picket');
const assert = require('chai').assert;
const { Writable } = require('stream');

class OutputStream extends Writable {
  constructor() {
    super();
    this._result = '';
  }

  _write(chunk, encodiing, callback) {
    this._result += chunk;
    callback();
  }

  get result() {
    return this._result;
  }
}

describe('Validate all rules', function() {
  it('<head></head> should contain <title> and the related <meta>.', async function () {
    const stream = new OutputStream();
    let picket = new Picket({
      rules: {
        h1: {},
        head: {},
        img: {},
        a: {},
        strong: {
          tagCount: 15,
        },
        customRule($, output) {
          output('my custom rule');
        },
      },
      output: 'stream',
      outputStream: stream,
    });
    await picket.checkString('<head></head>');
    assert.equal(
      stream.result,
      'No <title> tag in <head>\n' +
      'No <meta name="description"> tag in <head>\n' +
      'No <meta name="keywords"> tag in <head>\n' +
      'my custom rule\n'
    );
  });
});
