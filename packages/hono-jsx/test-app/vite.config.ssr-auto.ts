import inertia from '@inertiajs/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: false,
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@': __dirname,
    },
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'hono/jsx',
  },
  plugins: [
    inertia({
      ssr: {
        port: 13722,
      },
    }),
  ],
})
