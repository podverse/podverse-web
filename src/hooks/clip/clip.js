const
    errors = require('feathers-errors'),
    config = require('config.js');

function addURL (hooks) {
  let slug = hooks.result.slug || hooks.result.id;
  hooks.result.podverseURL = `${config.baseURL}/clips/${slug}`;
}

module.exports = {
  addURL
};
