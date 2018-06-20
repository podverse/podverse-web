#!/usr/local/bin/node
const spawn = require('child_process').spawn;
const isCi = require('is-ci');

const mochaArgs = ['--recursive'];

if (!isCi) {
  mochaArgs.push('-w', '--colors');
}

if (process.env.NODE_ENV == 'prod' || process.env.NODE_ENV == 'local' || process.env.NODE_ENV == 'test') {
  mochaArgs.push('/tmp/test/setup.js')
  mochaArgs.push('/tmp/test/');
} else {
  mochaArgs.push('test/setup.js')
  mochaArgs.push('test/');
}

const mocha = spawn('mocha', mochaArgs);

mocha.stdout.pipe(process.stdout);
mocha.stderr.pipe(process.stderr);

mocha.on('close', (code) => {
  process.exit(code);
});

mocha.on('error', err => {
  console.log(err);
});