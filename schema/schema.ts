export interface AllTodos {
  allTodos: {
    data: Todo[]
  }
}

interface Todo {
  _id: string
  task: string
  completed: boolean
}
