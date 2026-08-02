import { router } from '@inertiajs/hono-jsx'
import { useEffect } from 'hono/jsx'

export default (props: { name: string }) => {
  useEffect(() => {
    router.reload({ only: ['name'] })
  }, [])

  return <div>Name is {props.name}</div>
}
