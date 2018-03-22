#! /usr/bin/env node
'use strict';

const yargs = require('yargs');
let SEOPicket = require('./src/seo-picket');

let argv = yargs
  .usage('Usage: $0 --file [file path] OR $0 --string [HTML snippet]')
  .example('$0 --file foo.html --console', 'Parse foo.html and show SEO defect items')
  .option('file', {
    alias: 'f',
    describe: 'Path to a HTML file',
  })
  .option('string', {
    alias: 's',
    describe: 'A HTML snippet',
    type: 'string',
  })
  .option('console', {
    alias: 'c',
    describe: 'Show the result on console',
  })
  .option('outputFile', {
    alias: 'o',
    describe: 'Write the result to a specific file',
    type: 'string',
  })
  .option('rules', {
    alias: 'r',
    describe: 'Select some pre-defined rules',
    type: 'array',
    default: ['h1', 'head', 'img', 'a', 'strong'],
  })
  .option('strongCount', {
    type: 'number',
    describe: 'The low bound count of <strong> tag',
    default: 15,
  })
  .conflicts('outputFile', 'console')
  .conflicts('file', 'string')
  .alias('h', 'help').help('h')
  .alias('v', 'version')
  .argv;

let picketOpt = {
  rules: argv.rules.reduce((prev, current) => {
    prev[current] = {};
    return prev;
  }, {}),
};

if (picketOpt.rules.strong) {
  picketOpt.rules.strong.tagCount = argv.strongCount;
}

if (argv.outputFile) {
  picketOpt.output = 'file';
  picketOpt.outputFile = argv.outputFile;
} else {
  picketOpt.output = 'console';
}

let picket = new SEOPicket(picketOpt);

if (argv.file) {
  picket.check(argv.file);
} else if (argv.string) {
  picket.checkString(argv.string);
}

