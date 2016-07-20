const errors = require('feathers-errors');

function applyOwnerId (hooks) {
  hooks.data.ownerId = hooks.params.userId;
}

function ensureAuthenticated (hooks) {
  if (!hooks.params.userId) {
    throw new errors.NotAuthenticated()
  }
}

module.exports = {
  applyOwnerId,
  ensureAuthenticated
};
