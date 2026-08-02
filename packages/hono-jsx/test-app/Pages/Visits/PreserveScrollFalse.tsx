import type { Child, MouseEvent } from 'hono/jsx'
import { router } from '@inertiajs/hono-jsx'
import WithoutScrollRegion from '@/Layouts/WithoutScrollRegion.jsx'

const PreserveScrollFalse = ({ foo = 'default' }) => {
  const preserve = (e: MouseEvent) => {
    e.preventDefault()
    router.visit('/visits/preserve-scroll-false-page-two', { data: { foo: 'foo' }, preserveScroll: true })
  }

  const preserveFalse = (e: MouseEvent) => {
    e.preventDefault()
    router.visit('/visits/preserve-scroll-false-page-two', { data: { foo: 'bar' } })
  }

  const preserveCallback = (e: MouseEvent) => {
    e.preventDefault()
    router.visit('/visits/preserve-scroll-false-page-two', {
      data: {
        foo: 'baz',
      },
      preserveScroll: (page) => {
        console.log(JSON.stringify(page))
        return true
      },
    })
  }

  const preserveCallbackFalse = (e: MouseEvent) => {
    e.preventDefault()
    router.visit('/visits/preserve-scroll-false-page-two', {
      data: { foo: 'foo' },
      preserveScroll: (page) => {
        console.log(JSON.stringify(page))
        return false
      },
    })
  }

  const preserveGet = (e: MouseEvent) => {
    e.preventDefault()
    router.get('/visits/preserve-scroll-false-page-two', { foo: 'bar' }, { preserveScroll: true })
  }

  const preserveGetFalse = (e: MouseEvent) => {
    e.preventDefault()
    router.get('/visits/preserve-scroll-false-page-two', {
      foo: 'baz',
    })
  }

  return (
    <div
      style={{
        height: '800px',
        width: '600px',
      }}
    >
      <span className="text">
        This is the page that demonstrates scroll preservation without scroll regions when using manual visits
      </span>
      <span className="foo">Foo is now {foo}</span>

      <a href="#" onClick={preserve} className="preserve">
        Preserve Scroll
      </a>
      <a href="#" onClick={preserveFalse} className="reset">
        Reset Scroll
      </a>
      <a href="#" onClick={preserveCallback} className="preserve-callback">
        Preserve Scroll (Callback)
      </a>
      <br />
      <a href="#" onClick={preserveCallbackFalse} className="reset-callback">
        Reset Scroll (Callback)
      </a>
      <a href="#" onClick={preserveGet} className="preserve-get">
        Preserve Scroll (GET)
      </a>
      <a href="#" onClick={preserveGetFalse} className="reset-get">
        Reset Scroll (GET)
      </a>

      <a href="/non-inertia" className="off-site">
        Off-site link
      </a>
    </div>
  )
}

PreserveScrollFalse.layout = (page: Child) => <WithoutScrollRegion children={page} />

export default PreserveScrollFalse
