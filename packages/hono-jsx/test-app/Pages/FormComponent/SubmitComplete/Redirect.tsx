import { Form } from '@nkfr26/inertia-hono-jsx'

export default () => {
  return (
    <div>
      <h1>Form Redirect Test</h1>

      <Form method="post" onSubmitComplete={(form) => form.reset('name')}>
        {({ errors }) => (
          <>
            <div>
              <input type="text" name="name" id="name" placeholder="Name" value="John Doe" />
              {errors.name && <p id="error_name">{errors.name}</p>}
            </div>

            <div>
              <button type="submit">Submit</button>
            </div>
          </>
        )}
      </Form>
    </div>
  )
}
