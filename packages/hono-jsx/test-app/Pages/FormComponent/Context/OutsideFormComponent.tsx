import { useFormContext } from '@nkfr26/inertia-hono-jsx'

export default () => {
  const form = useFormContext()

  return form === undefined ? (
    <div>Correctly returns undefined when used outside a Form component</div>
  ) : (
    <div>Unexpectedly has form context</div>
  )
}
