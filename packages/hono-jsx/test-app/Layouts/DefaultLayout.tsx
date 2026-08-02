import type { Child } from 'hono/jsx'
export default ({ children }: { children: Child }) => {
  return (
    <div id="default-layout">
      <span>Default Layout</span>
      {children}
    </div>
  )
}
