const path = require('path')
const config = require('../config')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const resolve = function (dir) {
  return path.resolve(__dirname, '../', dir)
}

const assetsPath = function (p) {
  const assetsSub = process.env.NODE_ENV === 'production'
    ? config.prod.assetsSub
    : config.dev.assetsSub
  return path.posix.join(assetsSub, p)
}

module.exports = {
  devServer: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 8000,
    hot: true,
    contentBase: false,
    publicPath: '/',
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    quiet: true
  },
  devtool: '#source-map',
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: assetsPath('js/[name].[hash:7].js'),
    chunkFilename: assetsPath('js/[id].[hash:7].js'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [
          resolve(__dirname, '/src/')
        ],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {	
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
