const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const res = (mode) => {
    if (mode == 'development'){
        return 'server/public'
    }
    else{
        return 'server/public'
    }
}
module.exports = {

    entry: path.resolve(__dirname, 'src/scripts/pong.js'),

    mode : 'development',  // 'production'

    output: {
        path: path.resolve(__dirname, ''),
        filename: 'scripts/bundle.js'
    },
    devServer: {
        static: {
            publicPath: path.resolve(__dirname, ''),
            watch : true
        },
        host: 'localhost',
        port : 8888,
        open : true
    },
    module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name : '[name].[ext]',
              outputPath : 'images'
            }
          }
        ]
      },
      {
        test: /\.(mp3)/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name : '[name].[ext]',
              outputPath : 'sound'
            }
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/templates/*',
                    to:   'templates/[name][ext]'
                },
                {
                    from: 'src/images/*',
                    to:   'images/[name][ext]'
                },
                {
                    from: 'src/style/*',
                    to:   'style/[name][ext]'
                },
            ]
        })
    ]
};
module.exports.output.path = path.resolve(__dirname, res(module.exports.mode));
module.exports.devServer.static.publicPath = path.resolve(__dirname, res(module.exports.mode));

