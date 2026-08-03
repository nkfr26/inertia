import { Form } from '@nkfr26/inertia-hono-jsx'

export default () => {
  return (
    <div>
      <h1>OnSubmitComplete Reset Test</h1>

      <Form method="post" onSubmitComplete={(props) => props.reset('name')}>
        {({ errors }) => (
          <>
            <div>
              <input type="text" name="name" id="name" placeholder="Name" value="John Doe" />
              {errors.name && <p id="error_name">{errors.name}</p>}
            </div>

            <div>
              <input type="email" name="email" id="email" placeholder="Email" value="john@doe.biz" />
              {errors.email && <p id="error_email">{errors.email}</p>}
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
