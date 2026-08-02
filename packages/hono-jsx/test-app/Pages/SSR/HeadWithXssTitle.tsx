import { Head } from '@nkfr26/inertia-hono-jsx'

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
