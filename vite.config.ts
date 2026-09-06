import { readFileSync, existsSync } from 'fs'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Minimal .env loader for the Node-side dev server (api/generate.ts reads process.env directly).
// Vite's own client env handling only covers VITE_-prefixed vars exposed to the browser bundle —
// this is separate and intentionally never reaches client code.
function loadDotEnv() {
  if (!existsSync('.env')) return
  for (const line of readFileSync('.env', 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!(key in process.env)) process.env[key] = value
  }
}

// Serves api/generate.ts locally so `npm run dev` matches Vercel's /api/* behavior without `vercel dev`.
function apiDevMiddleware(): Plugin {
  return {
    name: 'api-generate-dev-middleware',
    configureServer(server) {
      loadDotEnv()
      for (const [key, value] of Object.entries(loadEnv('development', process.cwd(), ''))) if (!(key in process.env)) process.env[key] = value
      server.middlewares.use('/api/generate', async (req, res) => {
        const { default: handler } = await server.ssrLoadModule('/api/generate.ts')
        await handler(req, res)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevMiddleware()],
})
