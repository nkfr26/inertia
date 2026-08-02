import { createInertiaApp, type ResolvedComponent } from '@nkfr26/inertia-hono-jsx'
import createServer from '@nkfr26/inertia-hono-jsx/server'
import HonoJsxDOMServer from 'hono/jsx/dom/server'

createServer((page) =>
  createInertiaApp({
    page,
    render: HonoJsxDOMServer.renderToString,
    serverHead: (page) => page.props.head as string[],
    resolve: (name) => {
      const pages = import.meta.glob<ResolvedComponent>('./Pages/SSR/**/*.tsx', { eager: true })
      return pages[`./Pages/${name}.tsx`]
    },
    setup: ({ App, props }) => <App {...props} />,
    ...(page.url.includes('withTitleCallback') && {
      title: (title, page) => [title, page.props.titleSuffix].filter(Boolean).join(' | '),
    }),
  }),
)
