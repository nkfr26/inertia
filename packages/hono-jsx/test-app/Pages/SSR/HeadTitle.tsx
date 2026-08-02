import { Head } from '@inertiajs/hono-jsx'

export default () => {
  return (
    <>
      <Head title="SSR Head Title" />
      <div>
        <p>SSR head title test</p>
      </div>
    </>
  )
}
