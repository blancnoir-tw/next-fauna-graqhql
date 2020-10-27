import { query as q } from 'faunadb'

import { authClient } from '../../utils/fauna-client'
import { getAuthCookie, removeAuthCookie } from '../../utils/auth-cookies'

const logout = async (req, res) => {
  const token = getAuthCookie(req)

  if (!token) return res.status(200).end()

  try {
    await authClient(token).query(q.Logout(false))
    removeAuthCookie(res)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(error.reqestResult.statusCode).send(error.message)
  }
}

export default logout
