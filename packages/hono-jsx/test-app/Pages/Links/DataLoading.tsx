import { Link } from '@inertiajs/hono-jsx'

export default () => (
  <div>
    <Link href="/sleep" className="get">
      First
    </Link>
    <Link href="/sleep" className="get">
      Second
    </Link>
  </div>
)
