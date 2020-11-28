const {merge} = require('webpack-merge')
const webpack = require("webpack")
const baseConfig = require('./webpack.base.conf')
module.exports = merge(baseConfig, {
  mode: "production",
  plugins: [
    new webpack.BannerPlugin('版权所有，翻版必究')  
  ]
})