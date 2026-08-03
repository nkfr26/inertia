import { Link, usePoll } from '@nkfr26/inertia-hono-jsx'

export default () => {
  usePoll(500, {
    only: ['custom_prop'],
    onFinish() {
      console.log('hook poll finished')
    },
  })

  return <Link href="/">Home</Link>
}
