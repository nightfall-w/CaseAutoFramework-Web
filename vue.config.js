/*
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2020-01-09 16:55:41
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-15 11:58:05
 */
console.log("后端服务地址:" + process.env.VUE_APP_SERVER_URL)

module.exports = {
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
    }
  }
}