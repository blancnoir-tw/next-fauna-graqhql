import { Alert, Box, Button, Checkbox, Input, Label, Message } from 'theme-ui'
import { useState, useEffect, Fragment } from 'react'
import Router from 'next/router'
import { gql } from 'graphql-request'
import { useForm } from 'react-hook-form'

import { Todo } from '../schema/schema'
import { graphQLClient } from '../utils/graphql-client'

type Props = {
  defaultValues: FormData
  id: string
  token: string
}

type FormData = Omit<Todo, '_id'>

const EditForm = ({ defaultValues, id, token }: Props) => {
  const [errorMessage, setErrorMessage] = useState('')
  const { handleSubmit, register, reset, errors } = useForm<FormData>({
    defaultValues: { ...defaultValues },
  })

  useEffect(() => {
    reset(defaultValues)
  }, [reset, defaultValues])

  const onSubmit = handleSubmit(async ({ task, completed }) => {
    if (errorMessage) setErrorMessage('')

    const query = gql`
      mutation updateTodo($id: ID!, $task: String!, $completed: Boolean!) {
        updateTodo(id: $id, data: { task: $task, completed: $completed }) {
          task
          completed
        }
      }
    `

    const variables = { id, task, completed }

    try {
      await graphQLClient(token).request(query, variables)
      Router.push('/')
    } catch (err) {
      console.error(err)
      setErrorMessage(err.message)
    }
  })

  return (
    <Fragment>
      <Box as="form" onSubmit={onSubmit}>
        <Box mb={3}>
          <Label htmlFor="task">Task</Label>
          <Input type="text" name="task" ref={register({ required: 'Task is required' })} />
          {errors.task && <Alert variant="error">{errors.task.message}</Alert>}
        </Box>

        <Box mb={3}>
          <Label>
            Completed
            <Checkbox name="completed" ref={register()} />
          </Label>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Button type="submit">Update</Button>
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

export default EditForm
