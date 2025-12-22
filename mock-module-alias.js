// Version: 1
// Mocks module-alias to prevent errors during Next.js build.
// Webpack handles the actual alias resolution.
const mock = () => {};
mock.addAliases = () => {};
mock.addAlias = () => {};
mock.isPathMatchesAlias = () => false;
mock.reset = () => {};
module.exports = mock;
