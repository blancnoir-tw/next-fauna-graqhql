import { Alert, Box, Button, Heading, Input, Label, Message } from 'theme-ui'
import { Fragment, useState } from 'react'
import { GetServerSideProps } from 'next'
import Router from 'next/router'
import { gql } from 'graphql-request'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'

import { graphQLClient } from '../utils/graphql-client'
import { getAuthCookie } from '../utils/auth-cookies'

type Props = { token: string }

const New = ({ token }: Props) => {
  const { data: user } = useSWR('/api/user')
  const [errorMessage, setErrorMessage] = useState('')
  const { handleSubmit, register, errors } = useForm()

  const onSubmit = handleSubmit<{ task: string }>(async ({ task }) => {
    if (errorMessage) setErrorMessage('')

    const mutation = gql`
      mutation CreateTodo($task: String!, $owner: ID!) {
        createTodo(data: { task: $task, completed: false, owner: { connect: $owner } }) {
          task
          completed
          owner {
            _id
          }
        }
      }
    `

    const variables = { task, owner: user && user.id }

    try {
      await graphQLClient(token).request(mutation, variables)
      Router.push('/')
    } catch (err) {
      console.error(err)
      setErrorMessage(err.message)
    }
  })

  return (
    <Fragment>
      <Heading mb={3}>Create New Todo</Heading>
      <Box as="form" onSubmit={onSubmit}>
        <Box mb={3}>
          <Label htmlFor="task">Task</Label>
          <Input type="text" name="task" placeholder="do something" ref={register({ required: 'Task is required' })} />
          {errors.task && <Alert variant="error">{errors.task.message}</Alert>}
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Button type="submit">Create</Button>
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

export const getServerSideProps: GetServerSideProps = async ctx => {
  const token = getAuthCookie(ctx.req)
  return { props: { token: token || null } }
}

export default New
