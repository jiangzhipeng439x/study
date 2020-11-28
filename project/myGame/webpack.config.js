const webpack = require("webpack")
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  devServer: {
    // contentBase: path.resolve(__dirname, 'dist'),
    contentBase: "./dist",
    port: 8089,
    hot: true // 开启HMR
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'main.html',
      template: 'public/index.html',
      title:'游戏'
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin() // 热模块替换    
  ]
}