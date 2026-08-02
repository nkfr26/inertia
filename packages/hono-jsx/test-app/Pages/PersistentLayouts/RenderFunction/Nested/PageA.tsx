import type { Child } from 'hono/jsx'
import { Link } from '@inertiajs/hono-jsx'
import NestedLayout from '@/Layouts/NestedLayout.jsx'
import SiteLayout from '@/Layouts/SiteLayout.jsx'

const PageA = () => {
  return (
    <div>
      <span className="text">Nested Persistent Layout - Page A</span>
      <Link href="/persistent-layouts/render-function/nested/page-b">Page B</Link>
    </div>
  )
}

PageA.layout = (page: Child) => {
  return (
    <SiteLayout>
      <NestedLayout children={page} />
    </SiteLayout>
  )
}

export default PageA
