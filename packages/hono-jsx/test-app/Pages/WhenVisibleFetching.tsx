import { WhenVisible } from '@nkfr26/inertia-hono-jsx'

export default () => {
  return (
    <div style={{ marginTop: '5000px' }}>
      <WhenVisible data="lazyData" always fallback={<div>Loading lazy data...</div>}>
        {({ fetching }) => (
          <>
            <div>Lazy data loaded!</div>
            {fetching && <div>Fetching in background...</div>}
          </>
        )}
      </WhenVisible>
    </div>
  )
}
