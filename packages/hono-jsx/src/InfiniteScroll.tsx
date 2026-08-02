import {
  getScrollableParent,
  InfiniteScrollActionSlotProps,
  InfiniteScrollComponentBaseProps,
  InfiniteScrollRef,
  InfiniteScrollSlotProps,
  ReloadOptions,
  useInfiniteScroll,
  UseInfiniteScrollProps,
} from '@inertiajs/core'
import {
  Child,
  createElement,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'hono/jsx'
import type { JSX as HonoJSX } from 'hono/jsx'
import usePage from './usePage'

const resolveHTMLElement = (
  value: string | RefObject<HTMLElement | null> | null,
  fallback: HTMLElement | null,
): HTMLElement | null => {
  if (!value) {
    return fallback
  }

  // Ref object { current: HTMLElement | null }
  if (value && typeof value === 'object' && 'current' in value) {
    return value.current
  }

  // CSS Selector string
  if (typeof value === 'string') {
    return document.querySelector(value) as HTMLElement | null
  }

  return fallback
}

// Helper function to render slot content
const renderSlot = (
  slotContent: Child | ((props: InfiniteScrollActionSlotProps) => Child) | undefined,
  slotProps: InfiniteScrollActionSlotProps,
  fallback: Child = null,
): Child => {
  if (!slotContent) {
    return fallback
  }

  return typeof slotContent === 'function' ? slotContent(slotProps) : slotContent
}

type InfiniteScrollRefProp = RefObject<InfiniteScrollRef> | ((instance: InfiniteScrollRef | null) => void)

interface ComponentProps
  extends
    InfiniteScrollComponentBaseProps,
    Omit<HonoJSX.HTMLAttributes, keyof InfiniteScrollComponentBaseProps | 'children'> {
  children?: Child | ((props: InfiniteScrollSlotProps) => Child)

  // Element references for custom trigger detection (when you want different trigger elements)
  startElement?: string | RefObject<HTMLElement | null>
  endElement?: string | RefObject<HTMLElement | null>
  itemsElement?: string | RefObject<HTMLElement | null>

  // Render slots for UI components (when you want custom loading/action components)
  previous?: Child | ((props: InfiniteScrollActionSlotProps) => Child)
  next?: Child | ((props: InfiniteScrollActionSlotProps) => Child)
  loading?: Child | ((props: InfiniteScrollActionSlotProps) => Child)

  // Request options
  params?: ReloadOptions

  onlyNext?: boolean
  onlyPrevious?: boolean

  ref?: InfiniteScrollRefProp
}

const InfiniteScroll = ({
  data,
  buffer = 0,
  as = 'div',
  manual = false,
  manualAfter = 0,
  preserveUrl = false,
  reverse = false,
  autoScroll,
  children,
  startElement,
  endElement,
  itemsElement,
  previous,
  next,
  loading,
  params = {},
  onlyNext = false,
  onlyPrevious = false,
  ref,
  ...props
}: ComponentProps) => {
  const [startElementFromRef, setStartElementFromRef] = useState<HTMLElement | null>(null)
  const startElementRef = useCallback((node: HTMLElement | null) => setStartElementFromRef(node), [])

  const [endElementFromRef, setEndElementFromRef] = useState<HTMLElement | null>(null)
  const endElementRef = useCallback((node: HTMLElement | null) => setEndElementFromRef(node), [])

  const [itemsElementFromRef, setItemsElementFromRef] = useState<HTMLElement | null>(null)
  const itemsElementRef = useCallback((node: HTMLElement | null) => setItemsElementFromRef(node), [])

  const scrollProp = usePage().scrollProps?.[data]

  const [loadingPrevious, setLoadingPrevious] = useState(false)
  const [loadingNext, setLoadingNext] = useState(false)
  const [requestCount, setRequestCount] = useState(0)
  const [hasPreviousPage, setHasPreviousPage] = useState(!!scrollProp?.previousPage)
  const [hasNextPage, setHasNextPage] = useState(!!scrollProp?.nextPage)

  const [resolvedStartElement, setResolvedStartElement] = useState<HTMLElement | null>(null)
  const [resolvedEndElement, setResolvedEndElement] = useState<HTMLElement | null>(null)
  const [resolvedItemsElement, setResolvedItemsElement] = useState<HTMLElement | null>(null)

  // Update elements when refs or props change
  useEffect(() => {
    const element = startElement ? resolveHTMLElement(startElement, startElementFromRef) : startElementFromRef
    setResolvedStartElement(element)
  }, [startElement, startElementFromRef])

  useEffect(() => {
    const element = endElement ? resolveHTMLElement(endElement, endElementFromRef) : endElementFromRef
    setResolvedEndElement(element)
  }, [endElement, endElementFromRef])

  useEffect(() => {
    const element = itemsElement ? resolveHTMLElement(itemsElement, itemsElementFromRef) : itemsElementFromRef
    setResolvedItemsElement(element)
  }, [itemsElement, itemsElementFromRef])

  const scrollableParent = useMemo(() => getScrollableParent(resolvedItemsElement), [resolvedItemsElement])

  const callbackPropsRef = useRef({
    buffer,
    onlyNext,
    onlyPrevious,
    reverse,
    preserveUrl,
    params,
  })

  callbackPropsRef.current = {
    buffer,
    onlyNext,
    onlyPrevious,
    reverse,
    preserveUrl,
    params,
  }

  const [infiniteScroll, setInfiniteScroll] = useState<UseInfiniteScrollProps | null>(null)

  const dataManager = useMemo(() => infiniteScroll?.dataManager, [infiniteScroll])
  const elementManager = useMemo(() => infiniteScroll?.elementManager, [infiniteScroll])

  const scrollToBottom = useCallback(() => {
    if (scrollableParent) {
      scrollableParent.scrollTo({
        top: scrollableParent.scrollHeight,
        behavior: 'instant',
      })
    } else {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'instant',
      })
    }
  }, [scrollableParent])

  // Main setup effect - only recreate when structural dependencies change
  useLayoutEffect(() => {
    if (!resolvedItemsElement) {
      return
    }

    function syncStateFromDataManager() {
      setRequestCount(infiniteScrollInstance.dataManager.getRequestCount())
      setHasPreviousPage(infiniteScrollInstance.dataManager.hasPrevious())
      setHasNextPage(infiniteScrollInstance.dataManager.hasNext())
    }

    const infiniteScrollInstance = useInfiniteScroll({
      // Data
      getPropName: () => data,
      inReverseMode: () => callbackPropsRef.current!.reverse,
      shouldFetchNext: () => !callbackPropsRef.current!.onlyPrevious,
      shouldFetchPrevious: () => !callbackPropsRef.current!.onlyNext,
      shouldPreserveUrl: () => callbackPropsRef.current!.preserveUrl,
      getReloadOptions: () => callbackPropsRef.current!.params,

      // Elements
      getTriggerMargin: () => callbackPropsRef.current!.buffer,
      getStartElement: () => resolvedStartElement!,
      getEndElement: () => resolvedEndElement!,
      getItemsElement: () => resolvedItemsElement,
      getScrollableParent: () => scrollableParent,

      // Callbacks
      onBeforePreviousRequest: () => setLoadingPrevious(true),
      onBeforeNextRequest: () => setLoadingNext(true),
      onCompletePreviousRequest: ({ completed }) => {
        setLoadingPrevious(false)

        if (completed) {
          syncStateFromDataManager()
        }
      },
      onCompleteNextRequest: ({ completed }) => {
        setLoadingNext(false)

        if (completed) {
          syncStateFromDataManager()
        }
      },
      onDataReset: syncStateFromDataManager,
    })

    setInfiniteScroll(infiniteScrollInstance)
    const { dataManager, elementManager } = infiniteScrollInstance
    syncStateFromDataManager()

    elementManager.setupObservers()
    elementManager.processServerLoadedElements(dataManager.getLastLoadedPage())

    if (autoLoad) {
      elementManager.enableTriggers()
    }

    return () => {
      infiniteScrollInstance.flush()
      setInfiniteScroll(null)
    }
  }, [data, resolvedItemsElement, resolvedStartElement, resolvedEndElement, scrollableParent])

  const manualMode = useMemo(
    () => manual || (manualAfter > 0 && requestCount >= manualAfter),
    [manual, manualAfter, requestCount],
  )
  const autoLoad = useMemo(() => !manualMode, [manualMode])

  useEffect(() => {
    autoLoad ? elementManager?.enableTriggers() : elementManager?.disableTriggers()
  }, [autoLoad, onlyNext, onlyPrevious, resolvedStartElement, resolvedEndElement])

  useEffect(() => {
    // autoScroll defaults to reverse value if not explicitly set
    const shouldAutoScroll = autoScroll !== undefined ? autoScroll : reverse

    if (shouldAutoScroll) {
      scrollToBottom()
    }
  }, [scrollableParent])

  if (ref) {
    useEffect(() => {
      const exposed = {
        fetchNext: dataManager?.fetchNext || (() => {}),
        fetchPrevious: dataManager?.fetchPrevious || (() => {}),
        hasPrevious: dataManager?.hasPrevious || (() => false),
        hasNext: dataManager?.hasNext || (() => false),
      }

      if (typeof ref === 'function') {
        ref(exposed)
        return () => ref(null)
      }

      ref.current = exposed
      return () => {
        ref.current = null
      }
    }, [dataManager])
  }

  const headerAutoMode = autoLoad && !onlyNext
  const footerAutoMode = autoLoad && !onlyPrevious

  const sharedExposed: Pick<
    InfiniteScrollActionSlotProps,
    'loadingPrevious' | 'loadingNext' | 'hasPrevious' | 'hasNext'
  > = {
    loadingPrevious,
    loadingNext,
    hasPrevious: hasPreviousPage,
    hasNext: hasNextPage,
  }

  const exposedPrevious: InfiniteScrollActionSlotProps = {
    loading: loadingPrevious,
    fetch: dataManager?.fetchPrevious ?? (() => {}),
    autoMode: headerAutoMode,
    manualMode: !headerAutoMode,
    hasMore: hasPreviousPage,
    ...sharedExposed,
  }

  const exposedNext: InfiniteScrollActionSlotProps = {
    loading: loadingNext,
    fetch: dataManager?.fetchNext ?? (() => {}),
    autoMode: footerAutoMode,
    manualMode: !footerAutoMode,
    hasMore: hasNextPage,
    ...sharedExposed,
  }

  const exposedSlot: InfiniteScrollSlotProps = {
    loading: loadingPrevious || loadingNext,
    loadingPrevious,
    loadingNext,
  }

  const renderElements = []

  // Only render previous trigger if not using custom element selector/ref
  if (!startElement) {
    renderElements.push(
      <div ref={startElementRef}>
        {/* Render previous slot or fallback to loading indicator */}
        {renderSlot(previous, exposedPrevious, loadingPrevious ? renderSlot(loading, exposedPrevious) : null)}
      </div>,
    )
  }

  renderElements.push(
    createElement(
      as,
      { ...props, ref: itemsElementRef },
      typeof children === 'function' ? children(exposedSlot) : children,
    ),
  )

  // Only render next trigger if not using custom element selector/ref
  if (!endElement) {
    renderElements.push(
      <div ref={endElementRef}>
        {/* Render next slot or fallback to loading indicator */}
        {renderSlot(next, exposedNext, loadingNext ? renderSlot(loading, exposedNext) : null)}
      </div>,
    )
  }

  return <>{...(reverse ? [...renderElements].reverse() : renderElements)}</>
}

InfiniteScroll.displayName = 'InertiaInfiniteScroll'

export default InfiniteScroll

