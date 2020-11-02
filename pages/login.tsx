import { Alert, Box, Button, Heading, Input, Label, Message } from 'theme-ui'
import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
}

const Login = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const { handleSubmit, register, errors } = useForm()

  const onSubmit = handleSubmit<FormData>(async formData => {
    if (errorMessage) setErrorMessage('')

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    <Fragment>
      <Heading mb={3}>Login</Heading>
      <Box as="form" onSubmit={onSubmit}>
        <Box mb={3}>
          <Label htmlFor="email">Email</Label>
          <Input type="email" name="email" ref={register({ required: 'Email is required' })} />
          {errors.email && <Alert variant="error">{errors.email.message}</Alert>}
        </Box>

        <Box mb={3}>
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" ref={register({ required: 'Password is required' })} />
          {errors.password && <Alert variant="error">{errors.password.message}</Alert>}
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Button type="submit">Login</Button>
        </Box>
      </Box>

      {errorMessage && (
        <Message mt="3" variant="error">
          {errorMessage}
        </Message>
      )}
    </Fragment>
  )
}

export default Login
