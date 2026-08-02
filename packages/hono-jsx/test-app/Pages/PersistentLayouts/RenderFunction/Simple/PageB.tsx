import type { Child } from 'hono/jsx'
import { Link } from '@inertiajs/hono-jsx'
import SiteLayout from '@/Layouts/SiteLayout.jsx'

const PageB = () => {
  return (
    <div>
      <span className="text">Simple Persistent Layout - Page B</span>
      <Link href="/persistent-layouts/render-function/simple/page-a">Page A</Link>
    </div>
  )
}

PageB.layout = (page: Child) => <SiteLayout children={page} />

export default PageB
