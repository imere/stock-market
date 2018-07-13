const path = require('path')
const ora = require('ora')
const rm = require('rimraf')
const webpack = require('webpack')
const webpackConfig = require('./webpack.dev.conf')
const config = require('../config')

const spinner = ora('Building.....')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSub), err => {
  if (err) {
    throw err
  }
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) {
      throw err
    }
    process.stdout.write(stats.toString({
      colors: true,
      children: false,
      chunks: false,
      chunkModules: false,
      modules: false
    }) + '\n\n')
    if (stats.hasWarnings()) {
      console.warn(stats.toJson().warnings)
    }
    if (stats.hasErrors()) {
      console.error(stats.toJson().errors)
      process.exit(1)
    }
  })
})
