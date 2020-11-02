/** @jsxRuntime classic */
/** @jsx jsx */
import { Flex, Heading, jsx, NavLink } from 'theme-ui'
import { useRouter } from 'next/router'
import useSWR from 'swr'

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

  const renderNavLinks = () => {
    const navLinks = user
      ? [
          { onClick: () => router.push('/profile'), text: user.email },
          { onClick: logout, text: 'Logout' },
        ]
      : [
          { onClick: () => router.push('/login'), text: 'Login' },
          { onClick: () => router.push('/signup'), text: 'Signup' },
        ]

    return navLinks.map(({ onClick, text }, index) => (
      <NavLink key={index} sx={{ ml: 2, p: 2 }} onClick={onClick}>
        {text}
      </NavLink>
    ))
  }

  return (
    <header sx={{ color: '#fff', background: '#333' }}>
      <Flex
        as="nav"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: theme => `${theme.sizes.container}`,
          m: '0 auto',
          p: 2,
        }}
      >
        <Heading as="h1" sx={{ cursor: 'pointer', mr: 'auto' }} onClick={() => router.push('/')}>
          Home
        </Heading>

        {renderNavLinks()}
      </Flex>
    </header>
  )
}

export default Header
