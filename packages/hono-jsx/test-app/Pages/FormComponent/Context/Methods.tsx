import { Form } from '@inertiajs/hono-jsx'
import MethodsTestComponent from './MethodsTestComponent'

export default () => (
  <Form action="/form-component/context/methods" method="post">
    {({ errors }) => (
      <>
        {Object.keys(errors).length > 0 && <pre>{JSON.stringify(errors, null, 2)}</pre>}

        <input type="text" name="name" value="Initial Name" />
        <input type="email" name="email" value="initial@example.com" />
        <textarea name="bio" value="Initial bio" />

        <MethodsTestComponent />
      </>
    )}
  </Form>
)
