import { Link } from '@nkfr26/inertia-hono-jsx'
import { useState } from 'hono/jsx'

export default () => {
  const [href, setHref] = useState('/sleep')

  return (
    <div>
      <button onClick={() => setHref('/something-else')}>Change URL</button>
      <Link href={href} className="get">
        The Link
      </Link>
    </div>
  )
}
