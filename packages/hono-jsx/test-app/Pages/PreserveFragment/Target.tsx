import { usePage } from '@nkfr26/inertia-hono-jsx'

export default () => {
  const page = usePage()

  return (
    <div>
      <span id="current-url">{page.url}</span>
      <span id="target-text">This is the target page</span>
    </div>
  )
}
