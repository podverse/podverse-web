/* eslint-disable @typescript-eslint/camelcase */

require('dotenv').config()

const Nightwatch = require('nightwatch')
const browserstack = require('browserstack-local')

const { BROWSERSTACK } = require('../constants')

let bs_local

try {
  
  process.mainModule.filename = "./node_modules/nightwatch/bin/nightwatch"
  // Code to start browserstack local before start of test
  console.log("Connecting local")
  Nightwatch.bs_local = bs_local = new browserstack.Local()
  
  const capabilities = {
    'key': process.env.BROWSERSTACK_ACCESS_KEY,
    localIdentifier: BROWSERSTACK.BROWSERSTACK_LOCAL_IDENTIFER
  }

  bs_local.start(capabilities, function(error) {
    if (error) throw error

    console.log('Connected. Now testing...')
    Nightwatch.cli(function(argv) {
      Nightwatch.CliRunner(argv)
        .setup(null, function() {
          bs_local.stop(function() {})
        })
        .runTests(function() {
          bs_local.stop(function() {})
        })
    })
  })
} catch (ex) {
  console.log('There was an error while starting the test runner:\n\n')
  process.stderr.write(ex.stack + '\n')
  process.exit(2)
}
