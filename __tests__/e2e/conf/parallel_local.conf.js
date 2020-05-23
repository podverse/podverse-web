/* eslint-disable @typescript-eslint/camelcase */

require('dotenv').config()

// const browserstack = require('browserstack-local')

const nightwatch_config = {
  src_folders : [ "__tests__/e2e/tests" ],

  custom_commands_path: "./__tests__/e2e/extensions",

  selenium : {
    "start_process" : false,
    "host" : "hub-cloud.browserstack.com",
    "port" : 80
  },

  common_capabilities: {
    'build': 'Web - Local - parallel',
    'project': 'podverse-web',
    'browserstack.user': process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
    'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
    'browserstack.debug': true,
    'browserstack.local': true
  },

  test_settings: {
    default: {},
    chrome: {
      desiredCapabilities: {
        browser: "chrome"
      }
    },
    firefox: {
      desiredCapabilities: {
        browser: "firefox"
      }
    },
    safari: {
      desiredCapabilities: {
        browser: "safari"
      }
    }
  }
}

// Code to support common capabilites
for(const i in nightwatch_config.test_settings) {
  const config = nightwatch_config.test_settings[i]
  config['selenium_host'] = nightwatch_config.selenium.host
  config['selenium_port'] = nightwatch_config.selenium.port
  config['desiredCapabilities'] = config['desiredCapabilities'] || {}
  for(const j in nightwatch_config.common_capabilities) {
    config['desiredCapabilities'][j] = config['desiredCapabilities'][j] || nightwatch_config.common_capabilities[j]
  }
}

module.exports = nightwatch_config
