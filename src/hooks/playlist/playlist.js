const
    errors = require('feathers-errors'),
    config = require('config.js');

function addURL (hooks) {
  let slug = hooks.result.slug || hooks.result.id;
  hooks.result.url = `${config.baseURL}/playlists/${slug}`;
  console.log(hooks.result.url);
}

module.exports = {
  addURL
};
