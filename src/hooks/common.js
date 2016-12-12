const errors = require('feathers-errors');

function applyOwnerId (hooks) {
  if (hooks.params.userId) {
    hooks.data.ownerId = hooks.params.userId;
  }
}

module.exports = {
  applyOwnerId
};
