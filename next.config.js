const withTypescript = require('@zeit/next-typescript')
const withCss = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const path = require('path')
const webpack = require('webpack')

module.exports = withTypescript(withCss(withSass()))
