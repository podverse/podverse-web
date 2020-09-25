/* eslint-disable @typescript-eslint/camelcase */

require('dotenv').config()

const moment = require('moment')
const globalHooks = require('../hooks')
const timeoutOverride = parseInt(process.env.TEST_TIMEOUT_OVERRIDE) || 15000

const nightwatch_config = {
  src_folders: ["__tests__/e2e/tests"],

  custom_commands_path: "./__tests__/e2e/extensions",

  selenium: {
    "start_process": false,
    "host": "hub-cloud.browserstack.com",
    "port": 443
  },

  common_capabilities: {
    'build': `Web - Stage - ${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`,
    'project': 'podverse-web',
    'browserstack.user': process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
    'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
    'browserstack.debug': true
  },

  test_settings: {
    default: {
      "globals": {
        "waitForConditionTimeout": timeoutOverride,
        ...globalHooks
      }
    },
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
    ie: {
      desiredCapabilities: {
        browser: "internet explorer"
      }
    }
  },

  // "test_workers": {
  //   "enabled": true,
  //   "workers": 10
  // }
}

for (const i in nightwatch_config.test_settings) {
  const config = nightwatch_config.test_settings[i]
  config['selenium_host'] = nightwatch_config.selenium.host
  config['selenium_port'] = nightwatch_config.selenium.port
  config['desiredCapabilities'] = config['desiredCapabilities'] || {}
  for (const j in nightwatch_config.common_capabilities) {
    config['desiredCapabilities'][j] = config['desiredCapabilities'][j] || nightwatch_config.common_capabilities[j]
  }
}

module.exports = nightwatch_config
