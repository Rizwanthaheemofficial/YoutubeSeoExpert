import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // 🔥 REQUIRED FOR VERCEL (fixes blank screen)
    base: './',

    server: {
      port: 3000,
      host: true
    },

    plugins: [react()],

    define: {
      'process.env': {}, // prevent process undefined error
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    }
  }
})
