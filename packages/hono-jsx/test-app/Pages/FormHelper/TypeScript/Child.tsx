import type { Child } from 'hono/jsx'
// This component is used for checking the TypeScript implementation; there is no Playwright test depending on it.
import type { InertiaFormProps } from '@inertiajs/hono-jsx'

interface ChildProps {
  form: InertiaFormProps<{
    name: string
    email?: string
  }>
}

export default function Child({ form }: ChildProps) {
  return (
    <div>
      <p>Name: {form.data.name}</p>
      <p>Email: {form.data.email}</p>
    </div>
  )
}
