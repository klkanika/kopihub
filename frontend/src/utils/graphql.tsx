import { gql } from 'apollo-boost'
// const { makeExecutableSchema, gql } = require('apollo-server');
export const GET_USERS = gql`
  query GetUsers{
    users{
        id
    }
  }
`
export const CREATE_USER = gql`
mutation CreateUser($name: String!, $userName: String!, $password: String!){
  createOneUser(
      data: {
      name : $name
      userName  : $userName
      password  :  $password
      enableStatus : SHOW
      }
    ){
    id
    name
  }
}
`
export const CREATE_USER1 = gql`
mutation CreateUser($name: String!, $userName: String!, $password: String!){
  createUser(
      name : $name
      userName  : $userName
      password  :  $password
    ){
    id
    name
  }
}
`

export const LOGIN = gql`
mutation Login($userName: String!,$password:String!){
  login(userName : $userName, password : $password)
  	{
      id
      role
      userId
      createdAt
    }
  }
`
export const UPDATE_USER = gql`
mutation UpdateUser($enableStatus: EnableStatus!,$id:String!){
  updateOneUser(
    data : {
      enableStatus : $enableStatus
    }
    where : {
      id : "5c337622-0ff9-4cdc-b1a9-2ce3f9b4eff3"
    }
  )
  {
      id 
      name
      enableStatus
  }
} 
`
export const UPDATE_LOG_USER = gql`
mutation UpdateLogUser($id: String!,$role: UserRole!){
  updateOneLogUser(
    data : {
      role : $role
    }
    where : {
      id : $id
    }
  )
  {
      id 
      role
      userId
  }
} 
`

export const UPDATE_TASK_STATUS = gql`
mutation UpdateTaskStatus($id: String!,$status: TaskStatus!,$countTime: Int!, $finishTime: DateTime){
  updateOneTask(
    data : {
      status : $status
      countTime : $countTime
      finishTime : $finishTime
    }
    where : {
      id : $id
    }
  )
  {
      id 
      name
      status
      countTime
  }
} 
`

export const  CREATE_TASK = gql`
  mutation CreateTask($name: String!,$total: Int!,$finishTime:DateTime!,$countTime:Int!,$userId:String!){
    createTask(
      name : $name
      total : $total
      finishTime : $finishTime
      countTime : $countTime
      userId : $userId
  )
  {
      id 
      name
      countTime
      finishTime
      status
      priority
  }
} 
`

export const  UPDATE_TASK_ONGOING = gql`
  mutation UpdateTaskOngoing($finishTime:DateTime!,$countTime:Int!,$taskId:String!){
    updateTaskOngoing(
      finishTime : $finishTime
      countTime : $countTime
      taskId : $taskId
  )
  {
      id 
      name
      countTime
      finishTime
      status
      priority
  }
} 
`

export const  UPDATE_TASK_TIMEUP = gql`
  mutation UpdateTaskTimeup($taskId:String!){
    updateTaskTimeup(
      taskId : $taskId
  )
  {
      id 
      name
      countTime
      finishTime
      status
      priority
  }
} 
`

export const  UPDATE_TASK_COMPLETE = gql`
  mutation UpdateTaskComplete($taskId:String!){
    updateTaskComplete(
      taskId : $taskId
  )
  {
      id 
      name
      countTime
      finishTime
      status
      priority
  }
} 
`

export const  UPDATE_TASK_CANCEL = gql`
  mutation UpdateTaskCancel($taskId:String!){
    updateTaskCancel(
      taskId : $taskId
  )
  {
      id 
      name
      countTime
      finishTime
      status
      priority
  }
} 
`

export const  UPDATE_EDIT_TASK = gql`
  mutation UpdateEditTask($taskId:String!,$name:String!,$total:Int!){
    UpdateEditTask(
      taskId : $taskId
      name : $name
      total : $total
  )
  {
      id 
      name
      total
      countTime
      finishTime
      status
      priority
  }
} 
`

export const  UPDATE_TASK_PRIORITY = gql`
  mutation UpdateTaskPriority($taskId:String!,$priority:Int!){
    updateTaskPriority(
      taskId : $taskId
      priority : $priority
  )
  {
      id 
      name
      countTime
      finishTime
      status
      priority
  }
} 
`

export const GET_TASKS = gql`
query GetTaskAll{
  tasks (where : {OR: [{status : PENDING},{status : ONGOING},{status : TIMEUP}]}
    ,orderBy : [{status:desc},{priority:asc},{finishTime:asc}]
    ){
    id
    name
    countTime
    finishTime
    status
    priority
    total
  }
}
`

export const GET_PENDING_TASKS = gql`
query GetPendingTask{
  tasks (where : {OR: [{status : PENDING}]}
    ,orderBy : [{priority:asc}]
    ){
    id
    name
    countTime
    finishTime
    status
    priority
    total
    updatedAt
  }
}
`

export const GET_STEAMER = gql`
query GetSteamer{
  steamers(orderBy: [{steamerNo:asc}]){
    id
    steamerNo
    machineNo
    updatedAt
    updatedBy
    Task{
      id
    }
    taskId
  }
}
`

export const UPDATE_STEAMER = gql`
mutation updateOneSteamer($id: String!,$taskId: String!){
  updateOneSteamer(
    data : {
      Task : { connect : {id : $taskId}}
    }
    where : {
      id : $id
    }
  )
  {
      id
  }
} 
`

export const UPDATE_STEAMER_COMPLETE = gql`
mutation updateSteamerComplete($taskId: String!){
  updateSteamerComplete(taskId : $taskId)
} 
`


