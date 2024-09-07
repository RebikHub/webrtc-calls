import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({command}) => ({
  base: command !== 'serve' ? '/pwa-media-test/' : '/',
  plugins: [VitePWA({
    registerType: 'autoUpdate',
    strategies: 'injectManifest',
    filename: 'sw.js',
    devOptions: {
      enabled: true
    },
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
    manifest: {
      name: 'WebCalls',
      short_name: 'WebCalls',
      description: 'WebCalls',
      theme_color: '#222',
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png"
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
    }
  })],
}))