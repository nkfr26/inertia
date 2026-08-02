import { Link } from '@nkfr26/inertia-hono-jsx'

export default () => {
  return (
    <div>
      <Link href="/prefetch/form" prefetch>
        Go to Prefetch Form
      </Link>
    </div>
  )
}
