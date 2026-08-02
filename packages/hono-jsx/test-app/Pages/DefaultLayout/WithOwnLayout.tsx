import { Link } from '@nkfr26/inertia-hono-jsx'
import type { Child } from 'hono/jsx'
import PageLayout from '@/Layouts/PageLayout'

const WithOwnLayout = () => {
  return (
    <div>
      <span id="text">DefaultLayout/WithOwnLayout</span>
      <Link href="/default-layout">Back to Index</Link>
    </div>
  )
}

WithOwnLayout.layout = (page: Child) => <PageLayout children={page} />

export default WithOwnLayout
