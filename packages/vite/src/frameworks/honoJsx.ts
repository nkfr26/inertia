/**
 * hono-jsx Framework Configuration
 *
 * This file defines how the Vite plugin handles hono-jsx applications.
 * It serves as a reference for creating custom framework configurations.
 *
 * The SSR template shows what the plugin generates. For a user's SSR entry:
 *
 * ```js
 * import { createInertiaApp } from '@inertiajs/hono-jsx'
 *
 * createInertiaApp({
 *   resolve: (name) => resolvePageComponent(name),
 * })
 * ```
 *
 * In production, the plugin transforms it to:
 *
 * ```js
 * import { createInertiaApp } from '@inertiajs/hono-jsx'
 * import createServer from '@inertiajs/hono-jsx/server'
 * import { renderToString } from 'hono/jsx/dom/server'
 *
 * const render = await createInertiaApp({
 *   resolve: (name) => resolvePageComponent(name),
 * })
 *
 * createServer((page) => render(page, renderToString))
 * ```
 *
 * In development, it exports the render function directly for the Vite dev server.
 */

import type { FrameworkConfig } from '../types'

export const config: FrameworkConfig = {
  // Package name used to detect hono/jsx usage via import statements
  package: '@inertiajs/hono-jsx',

  // hono/jsx components can use either .tsx (TypeScript) or .jsx
  // The plugin tries .tsx first, then falls back to .jsx
  extensions: ['.tsx', '.jsx'],

  // hono/jsx components are exported as `export default`, so we need to extract .default
  extractDefault: true,

  // SSR template that wraps the createInertiaApp call with server bootstrap code
  // Uses import.meta.env.PROD to skip the standalone server in dev mode
  ssr: (configureCall, options) => `
import createServer from '@inertiajs/hono-jsx/server'
import { renderToString } from 'hono/jsx/dom/server'

const render = await ${configureCall}

const renderPage = (page) => render(page, renderToString)

if (import.meta.env.PROD) {
  createServer(renderPage${options})
}

export default renderPage
`,
}
