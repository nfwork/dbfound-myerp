const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "",
  devServer: {
    host: "0.0.0.0",
    port: 8081
  },
  pwa: {
    name: "WE记账",
    themeColor: "#428bca",
    msTileColor: "#428bca",
    manifestPath: "manifest.json",
    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
      navigateFallback: "index.html",
      exclude: [/\.map$/, /robots\.txt$/],
      runtimeCaching: [
        {
          urlPattern: /\/images\/.*\.(?:png|jpg|jpeg|gif|svg|webp|ico)$/i,
          handler: "CacheFirst",
          options: {
            cacheName: "weacc-static-images",
            cacheableResponse: {
              statuses: [0, 200]
            },
            expiration: {
              maxEntries: 80,
              maxAgeSeconds: 30 * 24 * 60 * 60
            }
          }
        },
        {
          urlPattern: ({ request }) => ["script", "style", "font"].includes(request.destination),
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "weacc-static-assets",
            cacheableResponse: {
              statuses: [0, 200]
            },
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 7 * 24 * 60 * 60
            }
          }
        }
      ]
    }
  }
})
