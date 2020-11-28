const path = require("path")
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  //entry: "./src", // 单入口
  entry: './src/main.js',
  output: {
    // 输出
    filename: 'app.js', // 打包的文件名单入口
    // filename: '[name].[chunkhash].js', // 其中多入口时name是entry的属性，例如上面的app,chunkhash是为了diff
    path: path.resolve(__dirname, "dist") // 打包到哪里，“__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      { 
        test: /\.ts$/,
        use: 'ts-loader' 
      },
      {
        test: /\.(png|svg|jpe?g)$/i,
        loader: 'url-loader',
        options: {
          esModule: false
        }
      },
      {
        test: /\.html$/,  //如果使用了html-loader，ejs语法会失效
        use: [
          // 应用多个 loader 和选项  
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {
              /* ... */
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      },
      {
        test: /\.xml$/,
        use: ["xml-loader"]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/, // 排除node_modules/bower_components目录下的文件，include则是包含
        use: {
          loader: "babel-loader"
          // options: {
          //   presets: ['@babel/preset-env']
          // }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'main.html',
      template: 'public/main.html',
    }),
    new CleanWebpackPlugin() 
  ]
};