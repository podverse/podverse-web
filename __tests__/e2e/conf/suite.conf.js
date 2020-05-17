/* eslint-disable @typescript-eslint/camelcase */

require('dotenv').config()

const nightwatch_config = {
  src_folders : [ "__tests__/e2e/tests" ],

  custom_commands_path: "./__tests__/e2e/extensions",

  selenium : {
    "start_process" : false,
    "host" : "hub-cloud.browserstack.com",
    "port": 443
  },

  test_settings: {
    default: {
      desiredCapabilities: {
        'build': 'Web - Stage',
        'project': 'podverse-web',
        'browserstack.user': process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
        'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
        'browserstack.debug': true,
        'os': 'Windows',
        'os_version': '10',
        'browser': 'chrome',
      }
    }
  },

  // "test_workers": {
  //   "enabled": false,
  //   "workers": 5
  // }   
};

// Code to copy seleniumhost/port into test settings
for(const i in nightwatch_config.test_settings){
  const config = nightwatch_config.test_settings[i];
  config['selenium_host'] = nightwatch_config.selenium.host;
  config['selenium_port'] = nightwatch_config.selenium.port;
}

module.exports = nightwatch_config;
