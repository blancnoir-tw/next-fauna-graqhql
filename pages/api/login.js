import { query as q } from 'faunadb'

import { guestClient } from '../../utils/fauna-client'
import { setAuthCookie } from '../../utils/auth-cookies'

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).send('Email and Password is required')
  }

  try {
    const auth = await guestClient.query(
      q.Login(q.Match(q.Index('user_by_email'), q.Casefold(email)), {
        password,
      })
    )

    if (!auth.secret) {
      return res.status(404).send('Auth secret is missing')
    }

    setAuthCookie(res, auth.secret)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(error.requestResult.statusCode).send(error.message)
  }
}

export default login
