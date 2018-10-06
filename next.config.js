const withCss = require('@zeit/next-css')
const withTypescript = require('@zeit/next-typescript')
const path = require('path')
const webpack = require('webpack')

module.exports = withTypescript(withCss({
  cssModules: true
}))



