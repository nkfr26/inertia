import { Link } from '@inertiajs/hono-jsx'
import { useState } from 'hono/jsx'

export default () => {
  const [name, setName] = useState('')
  const [remember, setRemember] = useState(false)
  const [untracked, setUntracked] = useState('')

  return (
    <div>
      <label>
        Full Name
        <input type="text" id="name" name="full_name" value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} />
      </label>
      <label>
        Remember Me
        <input
          type="checkbox"
          id="remember"
          name="remember"
          checked={remember}
          onChange={(e) => setRemember((e.target as HTMLInputElement).checked)}
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
