const path = require('path')
module.exports = {
  dev: {
    assetsSub: 'static',
    assetsPub: '/',
    proxyTable: {},
    host: '0.0.0.0',
    port: 8000,
    autpOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    useEslint: true,
    showEslintErrorsInOverlay: false,
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true,
    extract: false
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSub: 'static',
    assetsPub: '/',
    productionSourceMap: true,
    devtool: '#source-map',
    productionGzip: false,
  }
}
