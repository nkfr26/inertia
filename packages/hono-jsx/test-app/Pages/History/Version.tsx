import { Link } from '@inertiajs/hono-jsx'

export default () => {
  return (
    <>
      <Link href="/history/version/1">Page 1</Link>
      <Link href="/history/version/2">Page 2</Link>
    </>
  )
}
