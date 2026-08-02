import { Link } from '@nkfr26/inertia-hono-jsx'
import type { Child } from 'hono/jsx'
import NestedLayout from '@/Layouts/NestedLayout.jsx'
import SiteLayout from '@/Layouts/SiteLayout.jsx'

const PageB = () => {
  return (
    <div>
      <span className="text">Nested Persistent Layout - Page B</span>
      <Link href="/persistent-layouts/render-function/nested/page-a">Page A</Link>
    </div>
  )
}

PageB.layout = (page: Child) => {
  return (
    <SiteLayout>
      <NestedLayout children={page} />
    </SiteLayout>
  )
}

export default PageB
