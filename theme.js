import { roboto } from '@theme-ui/presets'

const theme = {
  ...roboto,
  styles: {
    ...roboto.styles,
  },
  colors: {
    ...roboto.colors,
    error: '#ff4136',
  },
  sizes: {
    container: '40rem',
  },
  forms: {
    input: {
      '&:focus': {
        outlineColor: 'primary',
      },
    },
  },
  messages: {
    error: {
      borderLeftColor: 'error',
      bg: 'gray',
      color: '#fafafa',
    },
  },
  alerts: {
    error: {
      color: 'error',
      bg: 'transparent',
      p: 1,
    },
  },
}
console.log(theme)

export default theme
