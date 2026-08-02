import type { MouseEvent } from 'hono/jsx'
import { router } from '@inertiajs/hono-jsx'

export default () => {
  const defaultVisit = (e: MouseEvent) => {
    e.preventDefault()
    router.post('/dump/post')
  }

  const basicVisit = (e: MouseEvent) => {
    e.preventDefault()
    router.visit('/dump/post', { method: 'post', data: { foo: 'bar' }, errorBag: 'visitErrorBag' })
  }

  const postVisit = (e: MouseEvent) => {
    e.preventDefault()
    router.post('/dump/post', { foo: 'baz' }, { errorBag: 'postErrorBag' })
  }

  return (
    <div>
      <span className="text">This is the page that demonstrates error bags using manual visits</span>
      <a href="#" onClick={defaultVisit} className="default">
        Default visit
      </a>
      <a href="#" onClick={basicVisit} className="visit">
        Basic visit
      </a>
      <a href="#" onClick={postVisit} className="get">
        POST visit
      </a>
    </div>
  )
}
