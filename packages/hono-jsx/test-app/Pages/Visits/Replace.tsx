import type { MouseEvent } from 'hono/jsx'
import { router } from '@inertiajs/hono-jsx'

export default () => {
  const replace = (e: MouseEvent) => {
    e.preventDefault()
    router.visit('/dump/get', { replace: true })
  }

  const replaceFalse = (e: MouseEvent) => {
    e.preventDefault()
    router.visit('/dump/get', { replace: false })
  }

  const replaceGet = (e: MouseEvent) => {
    e.preventDefault()
    router.get('/dump/get', {}, { replace: true })
  }

  const replaceGetFalse = (e: MouseEvent) => {
    e.preventDefault()
    router.get('/dump/get', {}, { replace: false })
  }

  return (
    <div>
      <span className="text">This is the links page that demonstrates manual replace</span>

      <a href="#" onClick={replace} className="replace">
        [State] Replace visit: true
      </a>
      <a href="#" onClick={replaceFalse} className="replace-false">
        [State] Replace visit: false
      </a>
      <a href="#" onClick={replaceGet} className="replace-get">
        [State] Replace GET: true
      </a>
      <a href="#" onClick={replaceGetFalse} className="replace-get-false">
        [State] Replace GET: false
      </a>
    </div>
  )
}
