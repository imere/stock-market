const path = require('path')
const config = require('../config')
const merge = require('webpack-merge')
const webpackBase = require('./webpack.base.conf')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
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

const webpackDev = merge(webpackBase, {
  mode: 'development',
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
  devtool: config.build.devtool,
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: false
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false
              }
            }
          ],
          fallback: 'vue-style-loader'
        })
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../static'),
        to: config.build.assetsSub,
        ignore: ['.*']
      }
    ]),
    new ExtractTextPlugin({
      filename: assetsPath('css/[name].[hash].css'),
      allChunks: true
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        warnings: false
      },
      sourceMap: false,
      parallel: true
    }),
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + ['js', 'css'] + ')$'),
      threshold: 10240,
      minRatio: 0.8
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minChunks: 3,
      cacheGroups: {
        a: {
          test: /^a.+/,
          name: 'a',
          priority: -10,
        },
        p: {
          test: /^p.+/,
          name: 'p',
          priority: -10,
        }
      }
    }
  }
})
module.exports = webpackDev
