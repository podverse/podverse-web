const spawn = require('child_process').spawn;
const isCi = require('is-ci');

const mochaCmd = ['--recursive', '--require', 'test/setup.js'];

if (!isCi) {
  mochaCmd.push('-w', '--colors');
}

const mocha = spawn('mocha', mochaCmd);

mocha.stdout.pipe(process.stdout);
mocha.stderr.pipe(process.stderr);

mocha.on('close', (code) => {
  process.exit(code);
});
