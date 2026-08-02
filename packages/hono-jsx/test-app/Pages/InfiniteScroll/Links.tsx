import { Link } from '@inertiajs/hono-jsx'

export default () => {
  return (
    <div>
      <Link href="/infinite-scroll-with-link">Go to InfiniteScrollWithLink</Link>
      <Link href="/infinite-scroll-with-link" prefetch>
        Go to InfiniteScrollWithLink (Prefetch)
      </Link>
    </div>
  )
}
