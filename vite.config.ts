import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  // 重要：設定 base 為後端的 context-path
  base: '/cloudadmin/',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // 打包配置
  build: {
    // 輸出目錄（後端專案的 static 目錄）
    outDir: 'dist',

    // 清空輸出目錄
    emptyOutDir: true,

    // 生成 source map（生產環境建議關閉）
    sourcemap: false,

    // 資源檔案大小警告限制（KB）
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // 分離 vendor chunk
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          axios: ['axios'],
        },
      },
    },
  },

  // 開發伺服器配置
  server: {
    port: 5173,
    proxy: {
      // API 請求代理到後端
      '/cloudadmin/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
