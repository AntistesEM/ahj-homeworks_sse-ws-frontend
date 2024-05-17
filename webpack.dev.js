const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = merge(common, {
  // Set the mode to development or production
  mode: 'development',
  // Control how source maps are generated
  devtool: 'inline-source-map',

  // Spin up a server for quick development
  // devServer: {
  //   historyApiFallback: true,
  //   open: true,
  //   compress: true
  // },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      proxy: 'http://localhost:8080/',
      serveStatic: [
        {
          route: '/dist',
          dir: 'dist'
        },
        {
          route: '/coverage/lcov-report',
          dir: 'coverage/lcov-report'
        }
      ]
    }, {
      reload: true
    })
  ],
});
