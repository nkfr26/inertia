import { Form } from '@inertiajs/hono-jsx'

export default ({
  user,
}: {
  user: {
    name: string
  }
}) => {
  return (
    <Form action="/form-component/default-value" method="patch">
      {({ errors }) => (
        <>
          <h1>Form Default Values</h1>

          <div>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" value={user.name} />
            <div id="error_name">{errors['user.name']}</div>
          </div>

          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  )
}
