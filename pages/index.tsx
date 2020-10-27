import { GetServerSideProps } from 'next'
import Link from 'next/link'
import useSWR from 'swr'
import { gql } from 'graphql-request'

import { graphQLClient } from '../utils/graphql-client'
import { getAuthCookie } from '../utils/auth-cookies'
import { AllTodos } from '../schema/schema'
import Layout from '../components/layout'
import styles from '../styles/home.module.css'

type Props = { token: string | null }

const Home = ({ token }: Props) => {
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

  if (error) return <div>failed to load</div>

  return (
    <Layout>
      <h1>Next Fauna GraphQL</h1>
      <Link href="/new">
        <a className={styles.link}>Create New Todo</a>
      </Link>
      {data ? (
        <ul>
          {data.allTodos.data.map(todo => (
            <li key={todo._id} className={styles.todo}>
              <span
                onClick={() => toggleTodo(todo._id, todo.completed)}
                style={todo.completed ? { textDecoration: 'line-through' } : { textDecoration: 'none' }}
              >
                {todo.task}
              </span>
              <span className={styles.edit}>
                <Link href="/todo/[id]" as={`/todo/${todo._id}`}>
                  <a>Edit</a>
                </Link>
              </span>
              <span onClick={() => deleteTodo(todo._id)} className={styles.delete}>
                Delete
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div>loading...</div>
      )}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const token = getAuthCookie(ctx.req)
  return { props: { token: token || null } }
}

export default Home
