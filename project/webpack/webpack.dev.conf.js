const {merge} = require('webpack-merge')
const webpack = require("webpack")
const baseConfig = require('./webpack.base.conf')
module.exports = merge(baseConfig, {
  devtool: "eval-source-map", // 开发环境方便调试，不要在生产环境使用，否则打包出来的文件会很大
  mode: 'development',
  devServer: {
    // contentBase: path.resolve(__dirname, 'dist'),
    contentBase: "./dist",
    port: 8089,
    hot: true // 开启HMR
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // 热模块替换    
  ]
})
