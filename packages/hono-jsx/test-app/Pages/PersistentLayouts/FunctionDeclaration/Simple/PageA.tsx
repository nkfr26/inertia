import { Link, usePage } from '@nkfr26/inertia-hono-jsx'
import FnSiteLayout from '@/Layouts/FnSiteLayout'

const PageA = () => {
  window._inertia_page_props = usePage().props

  return (
    <div>
      <span className="text">Simple Persistent Layout - Page A</span>
      <Link href="/persistent-layouts/function-declaration/simple/page-b">Page B</Link>
    </div>
  )
}

PageA.layout = FnSiteLayout

export default PageA
