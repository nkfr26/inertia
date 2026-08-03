import { Form } from '@nkfr26/inertia-hono-jsx'
import ChildComponent from './ChildComponent'

export default () => (
  <>
    <Form action="/dump/post" method="post">
      {({ isDirty, errors }) => (
        <>
          <div>
            <span>Form 1 Parent: {isDirty ? 'dirty' : 'clean'}</span>
            {errors.name && <span> | Error: {errors.name}</span>}
          </div>
          <input type="text" name="name" value="Form 1 Name" />
          <ChildComponent formId="form1" />
        </>
      )}
    </Form>

    <Form action="/dump/post" method="post">
      {({ isDirty, errors }) => (
        <>
          <div>
            <span>Form 2 Parent: {isDirty ? 'dirty' : 'clean'}</span>
            {errors.name && <span> | Error: {errors.name}</span>}
          </div>
          <input type="text" name="name" value="Form 2 Name" />
          <ChildComponent formId="form2" />
        </>
      )}
    </Form>
  </>
)
