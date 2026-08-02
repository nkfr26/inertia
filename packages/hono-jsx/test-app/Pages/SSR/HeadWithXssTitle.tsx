import { Head } from '@inertiajs/hono-jsx'

export default ({ title }: { title: string }) => {
  return (
    <>
      <Head title={title} />
      <div>
        <p>Head title escaping test</p>
      </div>
    </>
  )
}
