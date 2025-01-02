// import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { readFileSync } from "node:fs";
import path from "node:path";
import eslint from "vite-plugin-eslint";
// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  server: {
    https: {
      key: readFileSync(path.resolve(__dirname, "certs/localhost+1-key.pem")), // Приватный ключ
      cert: readFileSync(path.resolve(__dirname, "certs/localhost+1.pem")), // Сертификат
    },
    host: "192.168.0.164", // Укажите ваш IP-адрес
    // port: 5000, // Укажите порт
  },
  base: command !== "serve" ? "/" : "/",
  plugins: [
    // viteBasicSslPlugin(),
    eslint(),
    VitePWA({
      debug: true,
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "public",
      filename: "sw.js",
      injectRegister: null,
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      // injectManifest: {
      //   swSrc: "public/sw.js", // Исходный файл сервис-воркера
      //   swDest: "dist/sw.mjs", // Выходной файл сервис-воркера
      // },
      manifest: {
        name: "WebCalls",
        short_name: "WebCalls",
        description: "WebCalls",
        theme_color: "#222",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
}));
