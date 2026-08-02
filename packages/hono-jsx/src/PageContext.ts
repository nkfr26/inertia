import { Page } from '@inertiajs/core'
import { createContext } from 'hono/jsx'

const pageContext = createContext<Page | null>(null)
pageContext.displayName = 'InertiaPageContext'

export default pageContext
