import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import useSWR from 'swr'

import styles from './header.module.css'

const Header = () => {
  const router = useRouter()
  const fetcher = (url: string) => fetch(url).then(res => res.json())
  const { data: user, mutate: mutateUser } = useSWR('/api/user', fetcher, {
    shouldRetryOnError: false,
  })

  const logout = async () => {
    const res = await fetch('/api/logout')
    if (res.ok) {
      mutateUser(null)
      router.push('/login')
    }
  }

  return (
    <div className={styles.header}>
      <header>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>

          <ul>
            {user ? (
              <Fragment>
                <li>
                  <Link href="/profile">
                    <a>{user.email}</a>
                  </Link>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </Fragment>
            ) : (
              <Fragment>
                <li>
                  <Link href="/login">
                    <a>Login</a>
                  </Link>
                </li>
                <li>
                  <Link href="/signup">
                    <a>Signup</a>
                  </Link>
                </li>
              </Fragment>
            )}
          </ul>
        </nav>
      </header>
    </div>
  )
}

export default Header
