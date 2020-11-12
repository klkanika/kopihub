import React, { useState, useEffect, useRef } from 'react'
import Task from './Task';
import InsertTask from './InsertTask';
import SetTime from './SetTime';
import TimeUp from './TimeUp';
import Header from './Header';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  CREATE_TASK, UPDATE_LOG_USER, GET_TASKS, UPDATE_TASK_ONGOING, UPDATE_TASK_TIMEUP, UPDATE_TASK_COMPLETE
  , GET_STEAMER, UPDATE_STEAMER, UPDATE_STEAMER_COMPLETE
} from '../../utils/graphql';
import {
  useMutation, useQuery, useLazyQuery
} from '@apollo/react-hooks'
import { useHistory } from "react-router-dom";
import { useSocket } from 'use-socketio';
import Loadding from '../layout/loadding'

declare global {
  interface Window {
    playSound: any;
    pauseSound: any;
  }
}

function TaskView() {
  window.pauseSound()
  const history = useHistory()
  const userName = sessionStorage.getItem("loggedUserName");
  const [insertTask, setInsertTask] = useState(false)
  const [setTime, setSetTime] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [setTask, setSetTask] = useState(false);
  const [status, setStatus] = useState("");
  const [finishDate, setFinishDate] = useState(new Date)

  let search = window.location.search;
  let params = new URLSearchParams(search);
  let userRoleParam = params.get("userRole");

  const [userRole, setUserRole] = useState(userRoleParam ? userRoleParam : sessionStorage.getItem("loggedUserRole") ? sessionStorage.getItem("loggedUserRole") : "CASHIER")

  const [curTaskId, setCurTaskId] = useState("")

  function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>();

    // Remember the latest function.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current?.();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  const { data: tasksData, loading: tasksLoading } = useQuery(GET_TASKS, {
    fetchPolicy: 'no-cache',
    pollInterval: 5000,
    variables: {},
    onError: (err) => {
      window.alert(err)
    }
  });
  const tasks = (tasksData && tasksData.tasks) || []

  const toggleInsertTaskPopup = () => {
    history.push('/InsertTask')
  }

  const [UpdateLogUser] = useMutation(UPDATE_LOG_USER);

  const toggleSetTimePopup = (taskId: string, taskStatus: string, finishDate : Date) => {
    history.push('/SetTime/'+taskId+'/'+ taskStatus+'/'+finishDate)
  }

  const toggleSetTimeupPopup = (taskId: string) => {
    setCurTaskId(taskId)
    setTimeUp(!timeUp)
  }

  const [UpdateTaskTimeUp] = useMutation(UPDATE_TASK_TIMEUP)

  const updateTimeUp = (dbTaskId: string) => {
    UpdateTaskTimeUp({
      variables: {
        taskId: dbTaskId
      }
    }).then(
      res => {
      }
      , err => {
        console.log("Update task timeup failed")
      }
    );
  }

  const toggleRole = () => {
    if (userRole === "CASHIER") {
      setUserRole("CHEF")
      setInsertTask(false)
      UpdateLogUser({
        variables:
        {
          role: "CHEF"
          , id: sessionStorage.getItem("loggedId")
        }
      })
        .then(
          res => {
            sessionStorage.setItem("loggedUserRole", "CHEF")
          },
          err => console.log('change role error')
        )
    }
    else {
      setUserRole("CASHIER")
      UpdateLogUser({
        variables:
        {
          role: "CASHIER"
          , id: sessionStorage.getItem("loggedId")
        }
      })
        .then(
          res => {
            sessionStorage.setItem("loggedUserRole", "CASHIER")
          }
          ,
          err => console.log('change role error')
        )
    }

  }

  const [getSteamer, { called, loading: steamerLoading, data: steamerData }] = useLazyQuery(GET_STEAMER, {
    fetchPolicy: 'network-only',
    onCompleted: (sre) => {
    },
    onError: (err) => {
      window.alert(err)
    }
  });
  const steamer = (steamerData && steamerData.steamers) || []

  
  
  console.log("render taskview")
  return (
    <>
      {
        !tasks || tasksLoading ?
          <Loadding />
          :
          <div className="w-11/12 m-auto mt-8 mb-8">
            {/* {console.log('TV:'+sessionStorage.getItem("loggedUserRole"))} */}
            <Header username={userName ? userName : ""} userRole={userRole ? userRole : "CASHIER"} page="" toggleRole={toggleRole} className='' />

            <div className="flex flex-wrap">
              {
                tasks.map((item: any) => (
                  <div key={item.id} className="m-1">
                    <Task taskId={item.id} taskName={item.name} total={item.total} userRole={userRole ? userRole : "CASHIER"}
                      status={item.status} finishDate={new Date(item.finishTime)} page="TaskView"
                      setTime={toggleSetTimePopup} timeUp={updateTimeUp} toggleTimeUp={toggleSetTimeupPopup}
                      setStatus={setStatus} setFinishDate={setFinishDate} />
                  </div>
                ))
              }
              <div
                id="btnAddTask"
                onClick={toggleInsertTaskPopup}
                className="w-56 h-48 m-1 flex items-center justify-center text-xl text-gray-600"
                style={{
                  display: userRole === "CASHIER" ? "" : "none",
                  border: '1px dashed #ddd',
                  borderRadius: '5px',
                  flexFlow: 'column',
                }}
              >
                <PlusOutlined style={{ fontSize: '2em' }} />
                <div className="mt-4">เพิ่มโต๊ะ</div>
              </div>
            </div>

          </div>
      }
    </>
  );
}

export default TaskView;
