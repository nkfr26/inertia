import { escape } from 'es-toolkit/compat'
import { Child, Children, cloneElement, JSXNode, useContext, useLayoutEffect, useMemo } from 'hono/jsx'
import HeadContext from './HeadContext'

function flattenChildren(nodes: Child[]): Child[] {
  return nodes.flatMap((node) => (Array.isArray(node) ? flattenChildren(node) : [node]))
}

type InertiaHeadProps = {
  title?: string
  children?: Child
}

const Head = ({ children, title }: InertiaHeadProps) => {
  const headManager = useContext(HeadContext)
  const provider = useMemo(() => headManager!.createProvider(), [headManager])
  const isServer = typeof window === 'undefined'

  useLayoutEffect(() => {
    provider.reconnect()
    provider.update(renderNodes(children))
    return () => {
      provider.disconnect()
    }
  }, [provider, children, title])

  function ensureNodeHasInertiaProp(node: JSXNode) {
    return cloneElement(node, {
      'data-inertia': node.props['head-key'] !== undefined ? node.props['head-key'] : '',
    })
  }

  function renderNode(node: JSXNode) {
    const props = { ...node.props }

    for (const key of Object.keys(props)) {
      if (props[key] === null || props[key] === undefined) {
        props[key] = String(props[key])
      }
    }

    const nodeWithInertia = ensureNodeHasInertiaProp(
      Object.assign(Object.create(Object.getPrototypeOf(node)), node, { props }),
    )
    delete nodeWithInertia.props['head-key']
    return String(nodeWithInertia.toString())
  }

  function renderNodes(nodes: Child) {
    const elements = (Children.toArray(nodes) as Child[])
      .flatMap((node) => (Array.isArray(node) ? flattenChildren(node) : [node]))
      .filter((node) => node)
      .map((node) => renderNode(node as JSXNode))

    if (title && !elements.find((tag) => tag.startsWith('<title'))) {
      elements.push(`<title data-inertia="">${escape(title)}</title>`)
    }

    return elements
  }

  if (isServer) {
    provider.update(renderNodes(children))
  }

  return null
}
export default Head
