import type { Child } from 'hono/jsx'
export default ({ children }: { children: Child }) => {
  return (
    <div id="page-layout">
      <span>Page Layout</span>
      {children}
    </div>
  )
}
