import React, { useState, useEffect } from 'react'
import Task from './Task';
import InsertTask from './InsertTask';
import SetTime from './SetTime';
import TimeUp from './TimeUp';
import Header from './Header';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  CREATE_TASK, UPDATE_LOG_USER, GET_TASKS, UPDATE_TASK_ONGOING, UPDATE_TASK_TIMEUP,UPDATE_TASK_COMPLETE
} from '../../utils/graphql';
import {
  useMutation, useQuery,useLazyQuery
} from '@apollo/react-hooks'
import {useHistory} from "react-router-dom";
import { useSocket } from 'use-socketio';


function TaskView() {
  const history = useHistory()
  const userName = sessionStorage.getItem("loggedUserName");
  const [ insertTask, setInsertTask ] = useState(false)
  const [ setTime, setSetTime ] = useState(false)
  const [ timeUp, setTimeUp ] = useState(false)
  const [ tasks, setTasks] = useState([])
  const [ userRole, setUserRole] = useState(sessionStorage.getItem("loggedUserRole") ? sessionStorage.getItem("loggedUserRole") : "CASHIER")

  const { subscribe, unsubscribe } = useSocket("taskUpdate", (dataFromServer) =>
    getTaks()
  );

  useEffect(()=>{
    subscribe()
    return () =>{
      unsubscribe()
    }
  },[])
  
  const [ curTaskId, setCurTaskId ] = useState("")
  
  const [getTaks , {called, loading : taskLazyLoading,data : taskLazyData}] = useLazyQuery(GET_TASKS,{
    fetchPolicy: 'network-only',
    variables: {},
    onCompleted: (sre) => {
      setTasks(sre.tasks)
    },
    onError: (err) => {
      window.alert(err)
    }
  });

  const {data: tasksData, loading: tasksLoading} = useQuery(GET_TASKS,{
    fetchPolicy: 'network-only',
    variables: {},
    onCompleted: (sre) => {
      setTasks(sre.tasks)
    },
    onError: (err) => {
      window.alert(err)
    }
  });

  const toggleInsertTaskPopup = () => {
    setInsertTask(!insertTask)
  }

  const [UpdateLogUser] = useMutation(UPDATE_LOG_USER);

  const [CreateTask, { error, loading, data }] = useMutation(CREATE_TASK)

  const addTask = (taskName : string,total : number) => {
    setInsertTask(!insertTask)
    CreateTask({variables : {
      name: taskName,
      total: total,
      finishTime: new Date(),
      countTime: 0,
      userId: sessionStorage.getItem("loggedUserId")}}).then(
        res => {
          console.log("add task succes")
        }
        ,err => {
          console.log("add task failed")
        }
      );
  }

  const toggleSetTimePopup = (taskId: string) => {
    setCurTaskId(taskId)
    setSetTime(!setTime)
  }

  const toggleSetTimeupPopup = (taskId: string) => {
    setCurTaskId(taskId)
    setTimeUp(!timeUp)
    console.log("timeup:"+timeUp)
  }

  const [UpdateTaskOngoing] = useMutation(UPDATE_TASK_ONGOING)
  const [UpdateTaskTimeUp] = useMutation(UPDATE_TASK_TIMEUP)
  const [UpdateTaskComplete] = useMutation(UPDATE_TASK_COMPLETE)

  const updateFinishDate = (dbTaskId : string,time : number) => {
    var finishDate = new Date(); // get current date
    console.log(finishDate)
    finishDate.setHours(finishDate.getHours() ,finishDate.getMinutes() + time,finishDate.getSeconds() ,finishDate.getMilliseconds());
    console.log(finishDate)
    setSetTime(!setTime)
    console.log(time+","+ finishDate.valueOf.toString())
    UpdateTaskOngoing({variables : {
      countTime : time,
      finishTime : finishDate,
      taskId : dbTaskId}}).then(
        res => {
          console.log("Update task succes")
        }
        ,err => {
          console.log("Update task failed")
        }
      );
  }

  const updateTimeUp = (dbTaskId : string) => {
    UpdateTaskTimeUp({variables : {
      taskId : dbTaskId}}).then(
        res => {
          console.log("Update task timeup succes")
        }
        ,err => {
          console.log("Update task timeup failed")
        }
      )      ;
  }
  
  const updateComplete = (dbTaskId : string) => {
    setTimeUp(!timeUp)
    UpdateTaskComplete({variables : {
      taskId : dbTaskId}}).then(
        res => {
          console.log("Update task completed succes")
        }
        ,err => {
          console.log("Update task completed failed")
        }
      )      ;
  }

  const toggleRole = () => {
    if(userRole === "CASHIER"){
      setUserRole("CHEF")
      setInsertTask(false)
      UpdateLogUser({variables : 
        {role: "CHEF"
         ,id : sessionStorage.getItem("loggedId")}})
        .then(
            res => {
              sessionStorage.setItem("loggedUserRole","CHEF")
              console.log('change role success')
              console.log('change to chef'+sessionStorage.getItem("loggedUserRole"))
            },
            err => console.log('change role error')
            )  
    }
    else {
      setUserRole("CASHIER")
      UpdateLogUser({variables : 
        {role: "CASHIER"
         ,id : sessionStorage.getItem("loggedId")}})
        .then(
            res => {
            sessionStorage.setItem("loggedUserRole","CASHIER")
            console.log('change role success')
            console.log('change to cashier'+sessionStorage.getItem("loggedUserRole"))
          }
            ,
            err => console.log('change role error')
        )
    } 
    
  }

  return (
    <div className="w-11/12 m-auto mt-8 mb-8">
      {console.log('TV:'+sessionStorage.getItem("loggedUserRole"))}
      <Header username={userName? userName : ""} userRole={userRole? userRole : "CASHIER"} page="" toggleRole={toggleRole}/>
      {setTime && userRole === "CHEF" && <SetTime taskId={curTaskId} closePopup={toggleSetTimePopup} 
        saveTime={updateFinishDate} visible={setTime}/>}

      {timeUp && userRole === "CHEF" && <TimeUp taskId={curTaskId} closePopup={toggleSetTimeupPopup} 
        updateComplete={updateComplete} visible={timeUp}/>}
      {insertTask &&
          <InsertTask closePopup={toggleInsertTaskPopup} addTask={addTask} visible={insertTask}/>
      }
    <div className="flex flex-wrap">
    {
      tasks.map( (item: any, i) => (
        <div key={i} className="m-1">
          <Task taskId={item.id} taskName={item.name} total={item.total} userRole={userRole ? userRole : "CASHIER"}
              status={item.status} finishDate={new Date(item.finishTime)} page="TaskView"
              setTime={toggleSetTimePopup} timeUp={updateTimeUp} toggleTimeUp={toggleSetTimeupPopup}/>
        </div>
      ))
    }
    <div 
      id="btnAddTask" 
      onClick={toggleInsertTaskPopup} 
      className="w-48 m-1 flex items-center justify-center text-xl text-gray-600"
      style={{
        display: userRole === "CASHIER" ? "" : "none",
        border:'1px dashed #ddd',
        borderRadius:'5px',
        flexFlow: 'column',
        minHeight: '150px'
      }}
    >
      <PlusOutlined style={{fontSize:'2em'}}/>
      <div className="mt-4">เพิ่มโต๊ะ</div>
    </div>
    </div>

    </div>
  );
}

export default TaskView;
