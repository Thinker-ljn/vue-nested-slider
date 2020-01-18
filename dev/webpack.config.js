const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
  mode: 'development',
  entry: './dev/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use:  ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.js' ],
    alias: {
      '@': path.resolve(__dirname, '../src')
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'dev/index.html'
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
};
