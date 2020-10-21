export interface AllTodos {
  allTodos: {
    data: Todo[]
  }
}

export interface Todo {
  _id: string
  task: string
  completed: boolean
}
