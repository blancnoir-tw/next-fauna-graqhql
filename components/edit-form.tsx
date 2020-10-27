import { useState, useEffect, Fragment } from 'react'
import Router from 'next/router'
import { gql } from 'graphql-request'
import { useForm } from 'react-hook-form'

import { Todo } from '../schema/schema'
import utilStyles from '../styles/utils.module.css'
import { graphQLClient } from '../utils/graphql-client'

type Props = {
  defaultValues: FormData
  id: string
  token: string
}

type FormData = Omit<Todo, '_id'>

const EditForm = ({ defaultValues, id, token }: Props) => {
  const [errorMessage, setErrorMessage] = useState('')
  const { handleSubmit, register, reset, errors } = useForm<FormData>({ defaultValues: { ...defaultValues } })

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
      await graphQLClient().request(query, variables)
      Router.push('/')
    } catch (err) {
      console.error(err)
      setErrorMessage(err.message)
    }
  })

  useEffect(() => {
    reset(defaultValues)
  }, [reset, defaultValues])

  return (
    <Fragment>
      <form onSubmit={onSubmit} className={utilStyles.form}>
        <div>
          <label htmlFor="task">Task</label>
          <input type="text" name="task" ref={register({ required: 'Task is required' })} />
          {errors.task && (
            <span role="alert" className={utilStyles.error}>
              {errors.task.message}
            </span>
          )}
        </div>

        <div className={utilStyles.checkboxWrap}>
          <label htmlFor="completed">Completed</label>
          <input type="checkbox" name="completed" ref={register()} />
          {errors.completed && (
            <span role="alert" className={utilStyles.error}>
              {errors.completed.message}
            </span>
          )}
        </div>

        <div className={utilStyles.submit}>
          <button type="submit">Update</button>
        </div>
      </form>

      {errorMessage && (
        <p role="alert" className={utilStyles.errorMessage}>
          {errorMessage}
        </p>
      )}
    </Fragment>
  )
}

export default EditForm
