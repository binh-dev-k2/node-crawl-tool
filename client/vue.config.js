const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
        },
      },
    },
    resolve: {
      alias: {
        // vue$: 'vue/dist/vue.common.js',
        'jquery': './src/assets/js/jquery.js'
      }
    }
  },
})