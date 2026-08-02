import { type LayoutCallbackReturn, PageHandler, SharedPageProps } from '@inertiajs/core'
import { Child, FC } from 'hono/jsx'

export type LayoutFunction = (page: Child) => Child
export type LayoutCallback = (props: SharedPageProps) => LayoutCallbackReturn<FC<any>>
export type LayoutComponent = FC<{ children: Child }>

export type HonoJsxComponent = FC<any> & {
  layout?: LayoutComponent | LayoutComponent[] | LayoutFunction | ((props: any) => any)
}

export type HonoJsxPageHandlerArgs = Parameters<PageHandler<FC>>[0]
export type HonoJsxInertiaAppConfig = {
  strictMode?: boolean
}

export type SetStateAction<S> = S | ((prevState: S) => S)
export type Dispatch<A> = (value: A) => void
