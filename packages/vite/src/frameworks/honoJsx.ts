/**
 * Hono JSX Framework Configuration
 *
 * This file defines how the Vite plugin handles Hono JSX applications.
 * It serves as a reference for creating custom framework configurations.
 *
 * The SSR template shows what the plugin generates. For a user's SSR entry:
 *
 * ```js
 * import { createInertiaApp } from '@nkfr26/inertia-hono-jsx'
 *
 * createInertiaApp({
 *   resolve: (name) => resolvePageComponent(name),
 * })
 * ```
 *
 * In production, the plugin transforms it to:
 *
 * ```js
 * import { createInertiaApp } from '@nkfr26/inertia-hono-jsx'
 * import createServer from '@nkfr26/inertia-hono-jsx/server'
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
  // Package name used to detect Hono JSX usage via import statements
  package: '@nkfr26/inertia-hono-jsx',

  // Hono JSX components can use either .tsx (TypeScript) or .jsx
  // The plugin tries .tsx first, then falls back to .jsx
  extensions: ['.tsx', '.jsx'],

  // Hono JSX components are exported as `export default`, so we need to extract .default
  extractDefault: true,

  // SSR template that wraps the createInertiaApp call with server bootstrap code
  // Uses import.meta.env.PROD to skip the standalone server in dev mode
  ssr: (configureCall, options) => `
import createServer from '@nkfr26/inertia-hono-jsx/server'
import { renderToString } from 'hono/jsx/dom/server'

const render = await ${configureCall}

const renderPage = (page) => render(page, renderToString)

if (import.meta.env.PROD) {
  createServer(renderPage${options})
}

export default renderPage
`,
}
