import { useRemember } from '@inertiajs/hono-jsx'
import { useState } from 'hono/jsx'

export default ({ ...props }) => {
  const [untracked, setUntracked] = useState('')

  const [data, setData] = useRemember({ name: '', remember: false }, 'Example/ComponentB')

  return (
    <div {...props}>
      <span>This component uses a callback-style 'key' for the remember functionality.</span>
      <label>
        Full Name
        <input
          type="text"
          className="b-name"
          name="full_name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: (e.target as HTMLInputElement).value })}
        />
      </label>
      <label>
        Remember Me
        <input
          type="checkbox"
          className="b-remember"
          name="remember"
          checked={data.remember}
          onChange={(e) => setData({ ...data, remember: (e.target as HTMLInputElement).checked })}
        />
      </label>
      <label>
        Remember Me
        <input
          type="text"
          className="b-untracked"
          name="untracked"
          value={untracked}
          onChange={(e) => setUntracked((e.target as HTMLInputElement).value)}
        />
      </label>
    </div>
  )
}
