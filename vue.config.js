/*
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2020-01-09 16:55:41
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-04-01 21:43:44
 */
console.log("后端服务地址:" + process.env.VUE_APP_SERVER_URL)
const webpack = require('webpack');
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ['js', 'css']
module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8081
  },
  lintOnSave: true,
  configureWebpack: {
    resolve: {
      alias: {
        'components': '@/components',
        'content': 'components/content',
        'common': 'components/common',
        'assets': '@/assets',
        'network': '@/network',
        'views': '@/views',
      }
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 5,
        minChunkSize: 100
      })
    ]
  }
                                                                                                                           1, 2           Top