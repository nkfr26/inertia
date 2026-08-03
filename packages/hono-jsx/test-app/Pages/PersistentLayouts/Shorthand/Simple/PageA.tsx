import { Link, usePage } from '@nkfr26/inertia-hono-jsx'
import type { Child } from 'hono/jsx'
import SiteLayout from '@/Layouts/SiteLayout'

const PageA = () => {
  window._inertia_page_props = usePage().props

  return (
    <div>
      <span className="text">Simple Persistent Layout - Page A</span>
      <Link href="/persistent-layouts/shorthand/simple/page-b">Page B</Link>
    </div>
  )
}

PageA.layout = (page: Child) => <SiteLayout children={page} />

export default PageA
