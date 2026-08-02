import type { Child } from 'hono/jsx'
import { Link } from '@inertiajs/hono-jsx'
import SiteLayout from '@/Layouts/SiteLayout'

const PageA = () => {
  return (
    <div>
      <span className="text">Simple Persistent Layout - Page A</span>
      <Link href="/persistent-layouts/render-function/simple/page-b">Page B</Link>
    </div>
  )
}

PageA.layout = (page: Child) => <SiteLayout children={page} />

export default PageA
