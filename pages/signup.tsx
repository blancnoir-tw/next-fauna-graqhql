import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'

const Signup = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const { handleSubmit, register, watch, errors } = useForm()

  const onSubmit = handleSubmit(async formData => {
    if (errorMessage) setErrorMessage('')

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error(await res.text())

      router.push('/')
    } catch (err) {
      console.error(err)
      setErrorMessage(err.message)
    }
  })

  return (
    <Layout>
      <h1>Sign Up</h1>
      <form onSubmit={onSubmit} className={utilStyles.form}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            ref={register({ required: 'Email is required' })}
          />
          {errors.email && (
            <span role="alert" className={utilStyles.error}>
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="John-1234"
            ref={register({ required: 'Password is required' })}
          />
          {errors.password && (
            <span role="alert" className={utilStyles.error}>
              {errors.password.massage}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            name="password2"
            placeholder="John-1234"
            ref={register({ validate: value => value === watch('password') || 'Password do not match' })}
          />
          {errors.password2 && (
            <span role="alert" className={utilStyles.error}>
              {errors.password2.massage}
            </span>
          )}
        </div>

        <div className={utilStyles.submit}>
          <button type="submit">Sign up</button>
        </div>
      </form>

      {errorMessage && (
        <p role="alert" className={utilStyles.errorMessage}>
          {errorMessage}
        </p>
      )}
    </Layout>
  )
}

export default Signup
