import { InfiniteScroll } from '@inertiajs/hono-jsx'
import { useLayoutEffect, useState } from 'hono/jsx'
import { flushSync } from 'hono/jsx/dom'
import UserCard, { User } from './UserCard'

const LifecycleMarker = () => {
  useLayoutEffect(() => {
    console.log('marker mounted')
    return () => console.log('marker destroyed')
  }, [])
  return null
}

export default ({ users }: { users: { data: User[] } }) => {
  const [show, setShow] = useState(false)
  const [cycleCount, setCycleCount] = useState(0)

  const cycleMount = () => {
    flushSync(() => setShow(true))
    setShow(false)
    setCycleCount((c) => c + 1)
  }

  return (
    <div>
      <button onClick={cycleMount}>Cycle Mount</button>
      <p id="cycle-count">Cycles: {cycleCount}</p>

      {show && (
        <>
          <LifecycleMarker />
          <InfiniteScroll data="users" style={{ display: 'grid', gap: '20px' }}>
            {users.data.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </InfiniteScroll>
        </>
      )}
    </div>
  )
}
