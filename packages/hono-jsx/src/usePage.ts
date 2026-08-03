import { Page, PageProps, SharedPageProps } from '@inertiajs/core'
import { useContext } from 'hono/jsx'
import PageContext from './PageContext'

export default function usePage<TPageProps extends PageProps = PageProps>(): Page<TPageProps & SharedPageProps> {
  const pageRef = useContext(PageContext)

  if (!pageRef) {
    throw new Error('usePage must be used within the Inertia component')
  }

  return pageRef.current as Page<TPageProps & SharedPageProps>
}
