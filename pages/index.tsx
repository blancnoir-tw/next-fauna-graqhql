/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Heading, Message, Text, Button } from 'theme-ui'
import { Fragment } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { gql } from 'graphql-request'

import { graphQLClient } from '../utils/graphql-client'
import { getAuthCookie } from '../utils/auth-cookies'
import { AllTodos } from '../schema/schema'

type Props = { token: string | null }

const Home = ({ token }: Props) => {
  if (!token) return <Message variant="error">Please Login or Signup</Message>

  const router = useRouter()
  const fetcher = async (query: string) => await graphQLClient(token).request(query)
  const { data, error, mutate } = useSWR<AllTodos, Error>(
    gql`
      {
        allTodos {
          data {
            _id
            task
            completed
          }
        }
      }
    `,
    fetcher
  )

  const toggleTodo = async (id: string, completed: boolean) => {
    const query = gql`
      mutation PartialUpdateTodo($id: ID!, $completed: Boolean!) {
        partialUpdateTodo(id: $id, data: { completed: $completed }) {
          _id
          completed
        }
      }
    `

    const variables = { id, completed: !completed }

    try {
      await graphQLClient(token).setHeader('X-Schema-Preview', 'partial-update-mutation').request(query, variables)
      mutate()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteTodo = async (id: string) => {
    const query = gql`
      mutation DeleteTodo($id: ID!) {
        deleteTodo(id: $id) {
          _id
        }
      }
    `

    try {
      await graphQLClient().request(query, { id })
      mutate()
    } catch (err) {
      console.error(err)
    }
  }

  if (error) return <Message variant="error">failed to load</Message>

  return (
    <Fragment>
      <Heading mb={3}>Next Fauna GraphQL</Heading>
      <Button sx={{ cursor: 'pointer' }} onClick={() => router.push('/new')}>
        Create New Todo
      </Button>

      {data ? (
        <ul>
          {data.allTodos.data.map(todo => (
            <li sx={{ p: 1 }} key={todo._id}>
              <span
                onClick={() => toggleTodo(todo._id, todo.completed)}
                sx={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              >
                {todo.task}
              </span>
              <span
                onClick={() => router.push('/todo/[id]', `/todo/${todo._id}`)}
                sx={{
                  cursor: 'pointer',
                  color: 'primary',
                  mx: 2,
                  px: 2,
                  borderRight: '1px solid #ccc',
                  borderLeft: '1px solid #ccc',
                }}
              >
                Edit
              </span>
              <span onClick={() => deleteTodo(todo._id)} sx={{ cursor: 'pointer', color: 'error' }}>
                Delete
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <Text mt="3">Loading...</Text>
      )}
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const token = getAuthCookie(ctx.req)
  return { props: { token: token || null } }
}

export default Home
