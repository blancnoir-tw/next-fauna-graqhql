import { Container, ThemeProvider } from 'theme-ui'
import theme from '../theme'
import Head from 'next/head'
import type { AppProps } from 'next/app'

import Header from '../components/header'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Next Fauna GraphQL</title>
        <link rel="stylesheet" href="/favicon.ico" />
      </Head>

      <Header />
      <Container p={3}>
        <Component {...pageProps} />
      </Container>
    </ThemeProvider>
  )
}

export default App
