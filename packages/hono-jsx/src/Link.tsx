import {
  ActiveVisit,
  isUrlMethodPair,
  LinkComponentBaseProps,
  LinkPrefetchOption,
  mergeDataIntoQueryString,
  Method,
  PendingVisit,
  resolveUrlMethodPairComponent,
  router,
  shouldIntercept,
  shouldNavigate,
  VisitOptions,
} from '@inertiajs/core'
import {
  createElement,
  FC,
  KeyboardEvent,
  MouseEvent,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'hono/jsx'
import type { JSX as HonoJSX } from 'hono/jsx'
import { config } from '.'

type ElementType = keyof HonoJSX.IntrinsicElements | FC<any>

const noop = () => undefined

interface BaseInertiaLinkProps extends LinkComponentBaseProps {
  as?: ElementType
  onClick?: (event: MouseEvent) => void
}

export type InertiaLinkProps = BaseInertiaLinkProps &
  Omit<HonoJSX.HTMLAttributes, keyof BaseInertiaLinkProps> & {
    ref?: RefObject<unknown>
  }

const Link = ({
  children,
  as = 'a',
  data = {},
  href = '',
  method = 'get',
  preserveScroll = false,
  preserveState = undefined,
  preserveUrl = false,
  replace = false,
  only = [],
  except = [],
  headers = {},
  queryStringArrayFormat = 'brackets',
  async = false,
  onClick = noop,
  onCancelToken = noop,
  onBefore = noop,
  onStart = noop,
  onProgress = noop,
  onFinish = noop,
  onCancel = noop,
  onSuccess = noop,
  onError = noop,
  onPrefetching = noop,
  onPrefetched = noop,
  prefetch = false,
  cacheFor = 0,
  cacheTags = [],
  viewTransition = false,
  component = undefined,
  instant = false,
  pageProps = null,
  ref,
  ...props
}: InertiaLinkProps) => {
    const [inFlightCount, setInFlightCount] = useState(0)
    const hoverTimeout = useRef<number>(null)

    const _method = useMemo(() => {
      return isUrlMethodPair(href) ? href.method : (method.toLowerCase() as Method)
    }, [href, method])

    const resolvedComponent = useMemo(() => {
      if (component) {
        return component
      }

      if (instant && isUrlMethodPair(href)) {
        return resolveUrlMethodPairComponent(href)
      }

      return null
    }, [component, instant, href])

    const _as = useMemo(() => {
      if (typeof as !== 'string' || as.toLowerCase() !== 'a') {
        // Custom component or element
        return as
      }

      return _method !== 'get' ? 'button' : as.toLowerCase()
    }, [as, _method])

    const mergeDataArray = useMemo(
      () => mergeDataIntoQueryString(_method, isUrlMethodPair(href) ? href.url : href, data, queryStringArrayFormat),
      [href, _method, data, queryStringArrayFormat],
    )

    const url = useMemo(() => mergeDataArray[0], [mergeDataArray])
    const _data = useMemo(() => mergeDataArray[1], [mergeDataArray])

    const baseParams = useMemo<VisitOptions>(
      () => ({
        data: _data,
        method: _method,
        preserveScroll,
        preserveState: preserveState ?? _method !== 'get',
        preserveUrl,
        replace,
        only,
        except,
        headers,
        async,
        component: resolvedComponent,
        pageProps,
      }),
      [
        _data,
        _method,
        preserveScroll,
        preserveState,
        preserveUrl,
        replace,
        only,
        except,
        headers,
        async,
        resolvedComponent,
        pageProps,
      ],
    )

    const visitParams = useMemo<VisitOptions>(
      () => ({
        ...baseParams,
        viewTransition,
        onCancelToken,
        onBefore,
        onStart(visit: PendingVisit) {
          setInFlightCount((count) => count + 1)
          onStart(visit)
        },
        onProgress,
        onFinish(visit: ActiveVisit) {
          setInFlightCount((count) => count - 1)
          onFinish(visit)
        },
        onCancel,
        onSuccess,
        onError,
      }),
      [
        baseParams,
        viewTransition,
        onCancelToken,
        onBefore,
        onStart,
        onProgress,
        onFinish,
        onCancel,
        onSuccess,
        onError,
      ],
    )

    const prefetchModes: LinkPrefetchOption[] = useMemo(
      () => {
        if (prefetch === true) {
          return ['hover']
        }

        if (prefetch === false) {
          return []
        }

        if (Array.isArray(prefetch)) {
          return prefetch
        }

        return [prefetch]
      },
      Array.isArray(prefetch) ? prefetch : [prefetch],
    )

    const cacheForValue = useMemo(() => {
      if (cacheFor !== 0) {
        // If they've provided a value, respect it
        return cacheFor
      }

      if (prefetchModes.length === 1 && prefetchModes[0] === 'click') {
        // If they've only provided a prefetch mode of 'click',
        // we should only prefetch for the next request but not keep it around
        return 0
      }

      // Otherwise, default to 30 seconds
      return config.get('prefetch.cacheFor')
    }, [cacheFor, prefetchModes])

    const doPrefetch = useMemo(() => {
      return () => {
        router.prefetch(
          url,
          {
            ...baseParams,
            onPrefetching,
            onPrefetched,
          },
          { cacheFor: cacheForValue, cacheTags },
        )
      }
    }, [url, baseParams, onPrefetching, onPrefetched, cacheForValue, cacheTags])

    useEffect(() => {
      return () => {
        clearTimeout(hoverTimeout.current!)
      }
    }, [])

    useEffect(() => {
      if (prefetchModes.includes('mount')) {
        setTimeout(() => doPrefetch())
      }
    }, prefetchModes)

    const regularEvents = {
      onClick: (event: MouseEvent) => {
        onClick(event)

        if (shouldIntercept(event)) {
          event.preventDefault()

          router.visit(url, visitParams)
        }
      },
    }

    const prefetchHoverEvents = {
      onMouseEnter: () => {
        hoverTimeout.current = window.setTimeout(() => {
          doPrefetch()
        }, config.get('prefetch.hoverDelay'))
      },
      onMouseLeave: () => {
        clearTimeout(hoverTimeout.current!)
      },
      onClick: regularEvents.onClick,
    }

    const prefetchClickEvents = {
      onMouseDown: (event: MouseEvent) => {
        if (shouldIntercept(event)) {
          event.preventDefault()
          doPrefetch()
        }
      },
      onKeyDown: (event: KeyboardEvent) => {
        if (shouldNavigate(event)) {
          event.preventDefault()
          doPrefetch()
        }
      },
      onMouseUp: (event: MouseEvent) => {
        if (shouldIntercept(event)) {
          event.preventDefault()
          router.visit(url, visitParams)
        }
      },
      onKeyUp: (event: KeyboardEvent) => {
        if (shouldNavigate(event)) {
          event.preventDefault()
          router.visit(url, visitParams)
        }
      },
      onClick: (event: MouseEvent) => {
        onClick(event)

        if (shouldIntercept(event)) {
          // Let the mouseup/keyup event handle the visit
          event.preventDefault()
        }
      },
    }

    const elProps = useMemo(() => {
      if (_as === 'button') {
        return { type: 'button' }
      }

      if (_as === 'a' || typeof _as !== 'string') {
        return { href: url }
      }

      return {}
    }, [_as, url])

    return (
      <>
        {createElement(
          _as,
          {
            ...props,
            ...elProps,
            ref,
            ...(() => {
              if (prefetchModes.includes('hover')) {
                return prefetchHoverEvents
              }

              if (prefetchModes.includes('click')) {
                return prefetchClickEvents
              }

              return regularEvents
            })(),
            'data-loading': inFlightCount > 0 ? '' : undefined,
          },
          children,
        )}
      </>
    )
}
Link.displayName = 'InertiaLink'

export default Link
