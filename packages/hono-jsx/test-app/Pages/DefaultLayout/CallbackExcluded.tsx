import { Link } from '@inertiajs/hono-jsx'

export default () => {
  return (
    <div>
      <span id="text">DefaultLayout/CallbackExcluded</span>
      <Link href="/default-layout">Back to Index</Link>
    </div>
  )
}
