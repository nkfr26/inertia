import { Link, useRemember } from '@inertiajs/hono-jsx'
import { useState } from 'hono/jsx'

export default () => {
  const [untracked, setUntracked] = useState('')

  const [form, setForm] = useRemember({ name: '', remember: false })

  return (
    <div>
      <label>
        Full Name
        <input
          type="text"
          id="name"
          name="full_name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })}
        />
      </label>
      <label>
        Remember Me
        <input
          type="checkbox"
          id="remember"
          name="remember"
          checked={form.remember}
          onChange={(e) => setForm({ ...form, remember: (e.target as HTMLInputElement).checked })}
        />
      </label>
      <label>
        Untracked
        <input
          type="text"
          id="untracked"
          name="untracked"
          value={untracked}
          onChange={(e) => setUntracked((e.target as HTMLInputElement).value)}
        />
      </label>

      <Link href="/dump/get" className="link">
        Navigate away
      </Link>
    </div>
  )
}
