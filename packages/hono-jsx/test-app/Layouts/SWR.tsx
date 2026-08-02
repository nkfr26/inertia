import type { Child } from 'hono/jsx'
import { Link } from '@inertiajs/hono-jsx'

export default ({ children }: { children: Child }) => {
  return (
    <div>
      <Link href="/prefetch/swr/2" prefetch cacheFor="1s">
        1s Expired
      </Link>
      <Link href="/prefetch/swr/3" prefetch cacheFor={1000}>
        1s Expired (Number)
      </Link>
      <Link href="/prefetch/swr/4" prefetch cacheFor={['1s', '3s']}>
        1s Stale, 2s Expired
      </Link>
      <Link href="/prefetch/swr/5" prefetch cacheFor={[1000, 3000]}>
        1s Stale, 2s Expired (Number)
      </Link>
      <div>{children}</div>
    </div>
  )
}
