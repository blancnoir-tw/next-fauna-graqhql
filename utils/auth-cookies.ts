import { NextApiRequest, NextApiResponse } from 'next'
import { serialize, parse } from 'cookie'
import { IncomingMessage } from 'http'

const TOKEN_NAME = 'faunatoken'
const MAX_AGE = 60 * 60 * 8

export const setAuthCookie = (res: NextApiResponse, token: string) => {
  const cookie = serialize(TOKEN_NAME, token, {
    httpOnly: true,
    maxAge: MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  res.setHeader('Set-Cookie', cookie)
}

export const removeAuthCookie = (res: NextApiResponse) => {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
}

export const getAuthCookie = (req: NextApiRequest | IncomingMessage): string => {
  if ('cookies' in req) return req.cookies[TOKEN_NAME]

  const cookies = parse(req.headers.cookie || '')
  return cookies[TOKEN_NAME]
}
