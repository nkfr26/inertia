import type { Child } from 'hono/jsx'
import { Link, usePage } from '@inertiajs/hono-jsx'
import SiteLayout from '@/Layouts/SiteLayout.jsx'

const PageB = () => {
  window._inertia_page_props = usePage().props

  return (
    <div>
      <span className="text">Simple Persistent Layout - Page B</span>
      <Link href="/persistent-layouts/shorthand/simple/page-a">Page A</Link>
    </div>
  )
}

PageB.layout = (page: Child) => <SiteLayout children={page} />

export default PageB
