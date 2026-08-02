import { Link } from '@nkfr26/inertia-hono-jsx'

export default () => {
  return (
    <>
      <Link href="/once-props/page-a">Go to Page A</Link>
      <Link href="/once-props/page-b">Go to Page B</Link>
      <Link href="/once-props/page-d" prefetch="mount">
        Go to Page D
      </Link>
    </>
  )
}
