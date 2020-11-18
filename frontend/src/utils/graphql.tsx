import { gql } from 'apollo-boost'
// const { makeExecutableSchema, gql } = require('apollo-server');
export const GET_USERS = gql`
  query GetUsers{
    users{
        id
    }
  }
`

export const ALL_NOTIFICATION = gql`
  query notifications{
  notifications{
      id
      ,message
      ,hour
      ,minute
      ,token
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

export const CREATE_TASK = gql`
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

export const UPDATE_TASK_ONGOING = gql`
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

export const UPDATE_TASK_TIMEUP = gql`
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

export const UPDATE_TASK_COMPLETE = gql`
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

export const UPDATE_TASK_CANCEL = gql`
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

export const UPDATE_EDIT_TASK = gql`
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

export const UPDATE_TASK_PRIORITY = gql`
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

export const GET_QUEUES = gql`
query getQueues{
  getQueues{
    recentQueue{
      id
      queueNo
      status
      ordered
      userId
      seat
      name
      pictureUrl
      table {
        tableName
        ochaTableName
      }
    }
    activeQueues{
      id
      queueNo
      status
      ordered
      userId
      seat
      name
      pictureUrl
    }
  }
}
`

export const GET_SUCCESS_QUEUES = gql`
query getSuccessQueues($startDate: DateTime, $endDate: DateTime){
  queues(where: {
    AND: [
      {
        createdAt: {
          gte: $startDate
        }
      },
      {
        createdAt: {
          lt: $endDate
        }
      }
    ],
    status: SUCCESS
    },
    orderBy: {
      updateAt : desc
    }){
    queueNo,
    table {
      ochaTableName
      tableName
    },
    updateAt
  }
}
`

export const GET_TABLES = gql`
query getTables{
  tables{
    id
    ochaTableName
    tableName
  }
}
`

export const GET_QUEUE = gql`
query getQueue($id: Int!){
  queues(where : {id : {equals : $id}}){
    queueNo
    ordered
    status
    userId
  }
}
`

export const GET_MY_QUEUE = gql`
query getMyQueue ($userId: String!){
    getMyQueue (userId:$userId)
}
`

export const CANCEL_QUEUE = gql`
mutation cancelQueue($id: Int!){
  cancelQueue(id: $id)
}
`

export const FETCH_QUEUE = gql`
mutation fetchQueue($id : Int!, $tableId: Int){
  fetchQueue(id: $id, tableId: $tableId)
}
`

export const ORDER_FOOD = gql`
mutation orderFood($id : Int!){
  orderFood(id: $id)
}
`

export const BOOK_QUEUE = gql`
mutation bookQueue($userId: String, $seat: Int!, $name: String, $pictureUrl: String){
  bookQueue(userId: $userId, seat: $seat, name: $name, pictureUrl: $pictureUrl)
}
`

export const GET_EMPLOYEE = gql`
  query getEmployee ($id: String!){
    employees(where:{
      id: {
        equals: $id
      }
    }){
      id
      name
      hiringType
      earning
    }
  }
`

export const GET_EMPLOYEES = gql`
  query getEmployees{
    employees(where:{
      status : ACTIVE
    }){
      id
      name
      hiringType
      earning
    }
  }
`

export const CREATE_EMPLOYEE = gql`
mutation createEmployee($name: String!, $hiringType: HiringType!, $earning: Float!){
  createOneEmployee(
    data: {
      name : $name
      hiringType : $hiringType
      earning : $earning
      status : ACTIVE
    }
  ){
    id
  }
}
`

export const UPDATE_EMPLOYEE = gql`
mutation updateEmployee($id: String!, $name: String!, $hiringType: HiringType!, $earning: Float!){
  updateOneEmployee(
    data : {
      name : { set : $name }
      hiringType : $hiringType
      earning : { set : $earning }
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

export const DELETE_EMPLOYEE = gql`
mutation deleteEmployee($id: String!){
  updateOneEmployee(
    data : {
      status : DELETED
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

export const GET_WORKLOGS = gql`
  query getWorkLogs{
    workingHistories{
      id
      historyDate
      employee {
        name
      }
      hours
      earning
    }
  }
`

export const DELETE_WORKLOG = gql`
  mutation deleteWorkLog($id: String!){
    deleteOneWorkingHistory(
      where : {
        id : $id
      }
    ){
      id
    }
  } 
`

export const GET_EMLOYEES_EARNING = gql`
  query getEmployeesEarning{
    getEmployeesEarning{
      data{
        id
        name
        remainingEarning
      }
    }
  }
`

export const GET_ALL_NOTIFY_LOG = gql`
  query{
    getAllNotifyLog{
      data{
        id
        createdAt
        message
      }
    }
  }
`
export const CHECK_ADMIN = gql`
  query checkAdmin($id: String!){
    checkAdmin(id: $id){
      id,
      userName,
      is_admin
    }
  }
`

export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($message: String!,$hour: Int!,$minute:Int!,$token:String!,$userId:String!,$mon:Boolean!,$tue:Boolean!,$wed:Boolean!,$thu:Boolean!,$fri:Boolean!,$sat:Boolean!,$sun:Boolean!){
    createNotification(
      message : $message
      hour : $hour
      minute : $minute
      token : $token
      userId : $userId
      mon : $mon
      tue : $tue
      wed : $wed
      thu : $thu
      fri : $fri
      sat : $sat
      sun : $sun
  )
  {
      id 
      message
      hour
      minute
      token
  }
} 
`

export const UPDATE_NOTIFICATION = gql`
  mutation UpdateNotification($id: String!,$message: String!,$hour: Int!,$minute:Int!,$token:String!,$mon:Boolean!,$tue:Boolean!,$wed:Boolean!,$thu:Boolean!,$fri:Boolean!,$sat:Boolean!,$sun:Boolean!){
    updateNotification(
      id : $id
      message : $message
      hour : $hour
      minute : $minute
      token : $token
      mon : $mon
      tue : $tue
      wed : $wed
      thu : $thu
      fri : $fri
      sat : $sat
      sun : $sun
  )
  {
      id 
      message
      hour
      minute
      token
  }
} 
`