import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    define: {
      'process.env.VUE_APP_DEEPSEEK_KEY': JSON.stringify(env.VUE_APP_DEEPSEEK_KEY ?? ''),
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router'],
            pinia: ['pinia'],
            echarts: ['echarts'],
            utils: ['axios', 'gsap'],
          },
        },
      },
    },
  }
})
