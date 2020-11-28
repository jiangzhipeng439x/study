const path = require("path")
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  //entry: "./src", // 单入口
  entry: { // 多入口，其中，app是自定义的属性
    app1: './src/main1.js',
    app2: './src/main2.js',
    app3: './src/main3.js',
    app4: './src/main4.js'
  },
  output: {
    // 输出
    filename: '[name].js', // 打包的文件名单入口
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
        test: /\.html$/,
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
      filename: 'index1.html',
      template: 'public/index1.html',
      title:"这是第一个页面",
      hash:true,
      chunks:['app1']
    }),
    new HtmlWebpackPlugin({
      filename: 'index2.html',
      template: 'public/index2.html',
      title:"这是第二个页面",
      hash:true,
      chunks:['app1','app2']
    }),
    new HtmlWebpackPlugin({
      filename: 'index3.html',
      template: 'public/index2.html',
      title:"这是第三个页面",
      hash:true,
      chunks:['app1','app2','app3']
    }),
    new HtmlWebpackPlugin({
      filename: 'index4.html',
      template: 'public/index2.html',
      title:"这是第四个页面",
      hash:true,
      chunks:['app4']
    }),
    new CleanWebpackPlugin() 
  ]
};