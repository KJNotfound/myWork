import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      proxy: {
        '/__ai': {
          target: 'https://models.inference.ai.azure.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/__ai/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const key = env.VITE_DEEPSEEK_KEY || env.VUE_APP_DEEPSEEK_KEY
              if (key) {
                proxyReq.setHeader('api-key', key)
              }
            })
          },
        },
      },
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
