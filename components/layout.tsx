import { FC, Fragment } from 'react'
import Head from 'next/head'

import styles from './layout.module.css'

const Layout: FC = ({ children }) => (
  <Fragment>
    <Head>
      <title>Next Fauna GraphQL</title>
      <link rel="stylesheet" href="/favicon.ico" />
    </Head>

    <main>
      <div className={styles.container}>{children}</div>
    </main>
  </Fragment>
)

export default Layout
