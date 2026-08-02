import { router } from '@nkfr26/inertia-hono-jsx'
import type { MouseEvent } from 'hono/jsx'

export default () => {
  const locationVisit = (e: MouseEvent) => {
    e.preventDefault()
    router.visit('/location')
  }

  return (
    <div>
      <span className="text">This is the page that demonstrates location visits</span>

      <a href="#" onClick={locationVisit} className="example">
        Location visit
      </a>
    </div>
  )
}
