const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "",
  devServer: {
    host: "0.0.0.0",
    port: 8081,
    open: false,
    proxy: {
      "/proxy": {
        target: `https://dbfound.3g.net.cn/dbfound/`,
        changeOrigin: true
      }
    }
  },
  pwa: {
    name: "weacc",
    themeColor: "#428bca",
    msTileColor: "#efefef",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "./src/service-worker.js"
    }
  }
})
