import type { Child } from 'hono/jsx'
import { usePage } from '@inertiajs/hono-jsx'
import { useId, useState } from 'hono/jsx'

export default ({ children }: { children: Child }) => {
  const [createdAt] = useState(Date.now())

  window._inertia_layout_id = useId()
  window._inertia_site_layout_props = usePage().props

  return (
    <div>
      <span>Site Layout</span>
      <span>{createdAt}</span>
      <div>{children}</div>
    </div>
  )
}
