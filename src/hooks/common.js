
function applyOwnerId (hooks) {
  console.log(hooks);
}

function ensureAuthenticated (hooks) {
  console.log(hooks);
}

module.exports = {
  applyOwnerId,
  ensureAuthenticated
};
