'use strict';

const cheerio = require('cheerio');
const fs = require('fs');
const { Readable } = require('stream');

class StringStream extends Readable {
  constructor(string) {
    super();
    this._string = string;
  }

  _read() {
    this.push(this._string);
    this.push(null);
  }
}

function rulesFactory(name, option) {
  const preDefinedRules = {
    h1() {
      return function($, output) {
        if ($('h1').get().length > 1) {
          output('One more <h1> tags.');
        }
      };
    },
    img() {
      return function($, output) {
        if ($('img:not([alt])').get().length > 0) {
          output('One or more <img> tags without [alt] attribute');
        }
      };
    },
    a() {
      return function($, output) {
        if ($('a:not([rel])').get().length > 0) {
          output('One or more <a> tags without [rel] attribute');
        }
      };
    },
    head() {
      return function($, output) {
        if ($('head > title').get().length < 1) {
          output('No <title> tag in <head>');
        }

        if ($('head > meta[name=description]').get().length < 1) {
          output('No <meta name="description"> tag in <head>');
        }

        if ($('head > meta[name=keywords]').get().length < 1) {
          output('No <meta name="keywords"> tag in <head>');
        }
      };
    },
    strong() {
      return function($, output) {
        if ($('strong').get().length > option.tagCount) {
          output(`The count of <h1> tags are more than ${option.tagCount}.`);
        }
      };
    },
  };

  let rule = preDefinedRules[name];
  if (rule) {
    return rule();
  }

  if (option && option.run) {
    return option.run;
  }

  console.error('Invalid rule option:', name);

  return;
}

class Picket {
  constructor({rules, output, outputOpt}) {
    this.rules = Object.keys(rules).map(name => rulesFactory(name, rules[name]));
    let stream;
    switch (output) {
    case 'console':
      stream = process.stdout;
      break;
    case 'stream':
      stream = outputOpt;
      break;
    }
    this.output = function stdoutOutput(data) {
      stream.write(data + '\n');
    };
  }

  async checkString(input) {
    return await this.check(new StringStream(input));
  }

  async check(input) {
    let stream;

    if (typeof input === 'string') {
      stream = fs.createReadStream(input);
    } else if (input instanceof Readable) {
      stream = input;
    } else {
      return Promise.reject(new Error('Unknown input'));
    }

    return new Promise(resolve => {
      let html = '';
      stream.on('data', data => {
        html += data;
      });
      stream.on('end', () => {
        this.rules.filter(func => func)
          .forEach(rule => rule(cheerio.load(html), this.output));
        resolve();
      });
    });
  }
}

module.exports = Picket;

