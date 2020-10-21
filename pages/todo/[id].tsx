import { useRouter } from 'next/router'
import useSWR from 'swr'
import { gql } from 'graphql-request'

import { Todo as ITodo } from '../../schema/schema'
import Layout from '../../components/layout'
import EditForm from '../../components/edit-form'
import { graphQLClient } from '../../utils/graphql-client'

type Response = {
  findTodoByID: Omit<ITodo, '_id'>
}

const Todo = () => {
  const router = useRouter()
  const { id } = router.query

  const fetcher = async (query: string) => await graphQLClient.request(query, { id })
  const query = gql`
    query FindTodoByID($id: ID!) {
      findTodoByID(id: $id) {
        task
        completed
      }
    }
  `

  const { data, error } = useSWR<Response, Error>([query, id], fetcher)

  if (error) return <div>failed to load</div>

  return (
    <Layout>
      <h1>Edit Todo</h1>

      {data ? <EditForm defaultValues={data.findTodoByID} id={id as string} /> : <div>loading...</div>}
    </Layout>
  )
}

export default Todo
