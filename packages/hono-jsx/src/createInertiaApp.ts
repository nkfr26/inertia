/// <reference path="./env.d.ts" />
import {
  buildSSRBody,
  CreateInertiaAppOptions,
  CreateInertiaAppOptionsForCSR,
  CreateInertiaAppOptionsForSSR,
  exposeInterceptors,
  getInitialPageFromDOM,
  http as httpModule,
  InertiaAppSSRResponse,
  Page,
  PageProps,
  router,
  setupProgress,
  SharedPageProps,
} from '@inertiajs/core'
import { Child, createElement, StrictMode } from 'hono/jsx'
import { createRoot, hydrateRoot } from 'hono/jsx/dom/client'
import { renderToString } from 'hono/jsx/dom/server'
import App, { InertiaAppProps, type InertiaApp } from './App'
import { config } from './index'
import { HonoJsxComponent, HonoJsxInertiaAppConfig } from './types'

export type SetupOptions<ElementType, SharedProps extends PageProps> = {
  el: ElementType
  App: InertiaApp
  props: InertiaAppProps<SharedProps>
}

type ComponentResolver = (
  name: string,
  page?: Page<SharedPageProps>,
) => HonoJsxComponent | Promise<HonoJsxComponent> | { default: HonoJsxComponent }

type HonoJsxWithApp<SharedProps extends PageProps> = (
  app: Child,
  options: { ssr: boolean; page: Page<SharedProps> },
) => Child

type InertiaAppOptionsForCSR<SharedProps extends PageProps> = CreateInertiaAppOptionsForCSR<
  SharedProps,
  ComponentResolver,
  SetupOptions<HTMLElement, SharedProps>,
  void,
  HonoJsxInertiaAppConfig
> & {
  strictMode?: undefined
  withApp?: never
}

type InertiaAppOptionsForSSR<SharedProps extends PageProps> = CreateInertiaAppOptionsForSSR<
  SharedProps,
  ComponentResolver,
  SetupOptions<null, SharedProps>,
  Child,
  HonoJsxInertiaAppConfig
> & {
  render: typeof renderToString
  strictMode?: undefined
  withApp?: never
}

type InertiaAppOptionsAuto<SharedProps extends PageProps> = Omit<
  CreateInertiaAppOptions<
    ComponentResolver,
    SetupOptions<HTMLElement | null, SharedProps>,
    Child | void,
    HonoJsxInertiaAppConfig
  >,
  'setup'
> & {
  page?: Page<SharedProps>
  render?: undefined
  strictMode?: boolean
} & (
    | { setup?: undefined; withApp?: HonoJsxWithApp<SharedProps> }
    | { setup: (options: SetupOptions<HTMLElement | null, SharedProps>) => Child | void; withApp?: never }
  )

type RenderToString = (element: Child) => string

type RenderFunction<SharedProps extends PageProps> = (
  page: Page<SharedProps>,
  renderToString: RenderToString,
) => Promise<InertiaAppSSRResponse>

export default async function createInertiaApp<SharedProps extends PageProps = PageProps & SharedPageProps>(
  options: InertiaAppOptionsForCSR<SharedProps>,
): Promise<void>
export default async function createInertiaApp<SharedProps extends PageProps = PageProps & SharedPageProps>(
  options: InertiaAppOptionsForSSR<SharedProps>,
): Promise<InertiaAppSSRResponse>
export default async function createInertiaApp<SharedProps extends PageProps = PageProps & SharedPageProps>(
  options?: InertiaAppOptionsAuto<SharedProps>,
): Promise<void | RenderFunction<SharedProps>>
export default async function createInertiaApp<SharedProps extends PageProps = PageProps & SharedPageProps>(
  {
    id = 'app',
    resolve,
    setup,
    title,
    progress = {},
    page,
    render,
    defaults = {},
    nonce,
    http,
    layout,
    serverHead,
    strictMode = false,
    withApp,
    dev = !!import.meta.env?.DEV,
  }:
    | InertiaAppOptionsForCSR<SharedProps>
    | InertiaAppOptionsForSSR<SharedProps>
    | InertiaAppOptionsAuto<SharedProps> = {} as InertiaAppOptionsAuto<SharedProps>,
): Promise<InertiaAppSSRResponse | RenderFunction<SharedProps> | void> {
  config.replace(defaults)

  if (nonce) {
    config.set('nonce', nonce)
  }

  if (http) {
    httpModule.setClient(http)
  }

  if (dev) {
    exposeInterceptors()
  }

  const isServer = typeof window === 'undefined'

  const wrapWithStrictMode = (element: Child): Child => {
    return strictMode ? createElement(StrictMode, null, element) : element
  }

  const resolveComponent = (name: string, page?: Page) =>
    Promise.resolve(resolve!(name, page)).then((module) => {
      return ((module as { default?: HonoJsxComponent }).default || module) as HonoJsxComponent
    })

  // SSR render function factory - when on server without page/render, return a render function
  // This is used by the Vite plugin's SSR transform
  if (isServer && !page && !render) {
    return async (page: Page<SharedProps>, renderToString: RenderToString) => {
      let head: string[] = []

      const initialComponent = await resolveComponent(page.component, page)

      const props: InertiaAppProps<SharedProps> = {
        initialPage: page,
        initialComponent,
        resolveComponent,
        titleCallback: title,
        onHeadUpdate: (elements: string[]) => (head = elements),
        defaultLayout: layout,
        serverHead,
      }

      let honoJsxApp: Child

      if (setup) {
        honoJsxApp = (setup as (options: SetupOptions<null, SharedProps>) => Child)({
          el: null,
          App,
          props,
        })
      } else {
        honoJsxApp = wrapWithStrictMode(createElement(App, props))

        if (withApp) {
          honoJsxApp = withApp(honoJsxApp, { ssr: true, page })
        }
      }

      const html = renderToString(honoJsxApp)
      const body = buildSSRBody(id, page, html)

      return { head, body }
    }
  }

  const initialPage = page || getInitialPageFromDOM<Page<SharedProps>>(id)!

  let head: string[] = []

  const honoJsxApp = await Promise.all([
    resolveComponent(initialPage.component, initialPage),
    router.decryptHistory().catch(() => {}),
  ]).then(([initialComponent]) => {
    const props: InertiaAppProps<SharedProps> = {
      initialPage,
      initialComponent,
      resolveComponent,
      titleCallback: title,
      onHeadUpdate: isServer ? (elements: string[]) => (head = elements) : undefined,
      defaultLayout: layout,
      serverHead,
    }

    if (isServer) {
      return (setup as (options: SetupOptions<null, SharedProps>) => Child)({
        el: null,
        App,
        props,
      })
    }

    const el = document.getElementById(id)!
    el.style.overflowAnchor = 'none'

    if (setup) {
      return (setup as (options: SetupOptions<HTMLElement, SharedProps>) => void)({
        el,
        App,
        props,
      })
    }

    let appElement = wrapWithStrictMode(createElement(App, props))

    if (withApp) {
      appElement = withApp(appElement, { ssr: false, page: initialPage })
    }

    if (el.hasAttribute('data-server-rendered')) {
      hydrateRoot(el, appElement)
    } else {
      createRoot(el).render(appElement)
    }
  })

  if (!isServer && progress) {
    setupProgress(progress)
  }

  if (isServer && render && honoJsxApp) {
    const html = render(honoJsxApp)
    const body = buildSSRBody(id, initialPage, html)

    return { head, body }
  }
}
