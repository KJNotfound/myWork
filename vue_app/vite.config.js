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
          target: 'https://models.github.ai',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/__ai/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.VUE_APP_DEEPSEEK_KEY) {
                proxyReq.setHeader('Authorization', `Bearer ${env.VUE_APP_DEEPSEEK_KEY}`)
              }
              proxyReq.setHeader('Accept', 'application/vnd.github+json')
              proxyReq.setHeader('X-GitHub-Api-Version', '2022-11-28')
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
