import { Link, router } from '@inertiajs/hono-jsx'
import { useEffect } from 'hono/jsx'

export default () => {
  useEffect(() => {
    router.on('navigate', (event) => {
      console.log(String(event.detail.cached))
    })
  }, [])

  return (
    <>
      <Link href="/prefetch/navigate-event/cached" prefetch="mount">
        Prefetched Link
      </Link>
      <Link href="/prefetch/navigate-event/fresh">Regular Link</Link>
    </>
  )
}
