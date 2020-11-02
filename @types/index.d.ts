import { SxStyleProp } from 'theme-ui'

declare module 'react' {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    sx?: SxStyleProp
  }
}
