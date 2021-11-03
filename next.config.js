const { i18n } = require('./next-i18next.config')

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    prependData: '@import "~/styles/variables/index.scss";'
  },
  i18n
}
