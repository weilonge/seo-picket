#! /usr/bin/env node
'use strict';

let SEOPicket = require('./src/seo-picket');

let picket = new SEOPicket({
  rules: {
    h1: {},
    head: {},
    img: {},
    a: {},
    strong: {
      tagCount: 15,
    },
    customRules: {
      run: function($, output) {
        output('my custom rule');
      },
    },
  },
  output: 'console',
  outputOpt: 'log',
});

let inputType = 'string';

switch (inputType) {
case 'file':
  picket.check('test.html');
  break;
case 'string':
  picket.checkString(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Title!</title>
        <meta name="viewport" content="width=device-width"/>
        <meta name="description" content="test"/>
        <meta charset="UTF-8">
      </head>
      <body id="top">
        <div>
          <img src="headshot.jpg" alt="Norman" />
          <h1 class="">Norman</h1>
          <ul>
            <li><a target="_blank" href="http://test.com">test</a></li>
          </ul>
        </div>
      </body>
    </html>
  `);
  picket.checkString('<head></head>');
  break;
}

