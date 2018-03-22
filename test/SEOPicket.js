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
  const rules = {
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
  };

  it('<head></head> should contain <title> and the related <meta>.', async function () {
    const stream = new OutputStream();
    let picket = new Picket({
      rules,
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

  it('reading from fixtures.html should contain the correct result.', async function () {
    const stream = new OutputStream();
    let picket = new Picket({
      rules,
      output: 'stream',
      outputStream: stream,
    });
    await picket.check('test/fixtures.html');
    assert.equal(
      stream.result,
      'No <meta name="keywords"> tag in <head>\n' +
      'One or more <a> tags without [rel] attribute\n' +
      'my custom rule\n'
    );
  });
});
