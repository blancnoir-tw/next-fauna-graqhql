import { useState } from 'react'
import Router from 'next/router'
import { gql } from 'graphql-request'
import { useForm } from 'react-hook-form'

import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { graphQLClient } from '../utils/graphql-client'

const New = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const { handleSubmit, register, errors } = useForm()

  const onSubmit = handleSubmit<{ task: string }>(async ({ task }) => {
    if (errorMessage) setErrorMessage('')

    const query = gql`
      mutation CreateTodo($task: String!) {
        createTodo(data: { task: $task, completed: false }) {
          task
          completed
        }
      }
    `

    try {
      await graphQLClient.request(query, { task })
      Router.push('/')
    } catch (err) {
      console.error(err)
      setErrorMessage(err.message)
    }
  })

  return (
    <Layout>
      <h1>Create New Todo</h1>
      <form onSubmit={onSubmit} className={utilStyles.form}>
        <div>
          <label htmlFor="task">Task</label>
          <input type="text" name="task" placeholder="do something" ref={register({ required: 'Task is required' })} />
          {errors.task && (
            <span role="alert" className={utilStyles.error}>
              {errors.task.message}
            </span>
          )}
        </div>

        <div className={utilStyles.submit}>
          <button type="submit">Create</button>
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

export default New
