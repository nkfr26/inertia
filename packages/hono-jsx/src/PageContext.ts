import { Page } from '@inertiajs/core'
import { createContext } from 'hono/jsx'
import type { RefObject } from 'hono/jsx'

const pageContext = createContext<RefObject<Page> | null>(null)
pageContext.displayName = 'InertiaPageContext'

export default pageContext
