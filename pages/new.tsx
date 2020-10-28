import { GetServerSideProps } from 'next'
import { useState } from 'react'
import Router from 'next/router'
import { gql } from 'graphql-request'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'

import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
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

export const getServerSideProps: GetServerSideProps = async ctx => {
  const token = getAuthCookie(ctx.req)
  return { props: { token: token || null } }
}

export default New
