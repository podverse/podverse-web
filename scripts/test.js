const spawn = require('child_process').spawn;
const isCi = require('is-ci');

const mochaArgs = ['--recursive'];

if (!isCi) {
  mochaArgs.push('-w', '--colors');
}

mochaArgs.push('test/setup.js')
mochaArgs.push('test/');

const mocha = spawn('mocha', mochaArgs);

mocha.stdout.pipe(process.stdout);
mocha.stderr.pipe(process.stderr);

mocha.on('close', (code) => {
  process.exit(code);
});
