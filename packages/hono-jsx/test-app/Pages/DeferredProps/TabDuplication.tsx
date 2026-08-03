import { Deferred, usePage } from '@nkfr26/inertia-hono-jsx'

const Message = () => {
  const { message } = usePage<{ message?: string }>().props

  return <div id="message">{message}</div>
}

export default () => {
  return (
    <Deferred data="message" fallback={<div id="fallback">Loading message...</div>}>
      <Message />
    </Deferred>
  )
}
