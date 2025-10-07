/**
 * 應用程式入口點
 *
 * 負責：
 * 1. 建立 Vue 應用實例
 * 2. 註冊全域插件（Pinia、Router）
 * 3. 掛載應用到 DOM
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/style/main.css' // Tailwind CSS

// 建立 Vue 應用實例
const app = createApp(App)

// 建立 Pinia 實例
const pinia = createPinia()

// 註冊插件
app.use(pinia)
app.use(router)

// 掛載應用
app.mount('#app')
