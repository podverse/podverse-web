const withTypescript = require('@zeit/next-typescript')
const withCss = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const path = require('path')
const webpack = require('webpack')
const withImages = require('next-images')

module.exports = withImages(withTypescript(withCss(withSass({
  webpack(config, options) {
    return {
      ...config,
      node: {
        fs: 'empty'
      }
    }
  }
}))))
