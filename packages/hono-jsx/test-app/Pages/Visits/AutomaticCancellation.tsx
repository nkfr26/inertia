import type { MouseEvent } from 'hono/jsx'
import { router } from '@inertiajs/hono-jsx'

export default () => {
  const visit = (e: MouseEvent) => {
    e.preventDefault()
    router.get(
      '/sleep',
      {},
      {
        onStart: () => console.log('started'),
        onCancel: () => console.log('cancelled'),
      },
    )
  }

  return (
    <div>
      <span className="text">This is the page that demonstrates that only one visit can be active at a time</span>
      <a href="#" onClick={visit} className="visit">
        Link
      </a>
    </div>
  )
}
