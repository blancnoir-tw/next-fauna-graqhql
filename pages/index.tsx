import Link from 'next/link'
import useSWR from 'swr'
import { gql } from 'graphql-request'

import { graphQLClient } from '../utils/graphql-client'
import { AllTodos } from '../schema/schema'
import Layout from '../components/layout'
import styles from '../styles/home.module.css'

const fetcher = async (query: string) => await graphQLClient.request(query)

const Home = () => {
  const { data, error } = useSWR<AllTodos, Error>(
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
              <span>{todo.task}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div>loading...</div>
      )}
    </Layout>
  )
}

export default Home
