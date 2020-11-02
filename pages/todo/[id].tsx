import { Heading, Text } from 'theme-ui'
import { Fragment } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { gql } from 'graphql-request'

import { Todo as ITodo } from '../../schema/schema'
import EditForm from '../../components/edit-form'
import { graphQLClient } from '../../utils/graphql-client'
import { getAuthCookie } from '../../utils/auth-cookies'

type Response = { findTodoByID: Omit<ITodo, '_id'> }
type Props = { token: string }

const Todo = ({ token }: Props) => {
  const router = useRouter()
  const { id } = router.query

  const fetcher = async (query: string) => graphQLClient(token).request(query, { id })

  const query = gql`
    query FindTodoByID($id: ID!) {
      findTodoByID(id: $id) {
        task
        completed
      }
    }
  `

  const { data, error } = useSWR<Response, Error>([query, id], fetcher)

  if (error) return <Text>failed to load</Text>

  return (
    <Fragment>
      <Heading mb={3}>Edit Todo</Heading>
      {data ? <EditForm defaultValues={data.findTodoByID} id={id as string} token={token} /> : <Text>loading...</Text>}
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const token = getAuthCookie(ctx.req)
  return { props: { token: token || null } }
}

export default Todo
