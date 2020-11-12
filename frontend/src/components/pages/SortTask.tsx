import React, {useState, useEffect, useRef} from 'react'
import {useQuery,useLazyQuery,useMutation} from '@apollo/react-hooks'
import {
  GET_PENDING_TASKS, UPDATE_TASK_PRIORITY, UPDATE_EDIT_TASK
} from '../../utils/graphql';
import { ReactSortable } from "react-sortablejs";
import TaskNew from './TaskNew';
import { Modal } from 'antd';
import {useHistory} from "react-router-dom";
import Header from './Header';
import Loadding from '../layout/loadding'

function SortTask() {
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let userRoleParam = params.get("userRole");

  const history = useHistory()
  const [ tasks, setTasks] = useState([])
  const [ updatedAt, setUpdatedAt] = useState(new Date)
  const userName = sessionStorage.getItem("loggedUserName");
  const [userRole, setUserRole] = useState(userRoleParam ? userRoleParam : sessionStorage.getItem("loggedUserRole") ? sessionStorage.getItem("loggedUserRole") : "CASHIER")
  const [ setTask, setSetTask ] = useState(false);

  const [getTaksCompare , {called, loading : taskLazyLoading, data : taskLazyData}] = useLazyQuery(GET_PENDING_TASKS,{
    // fetchPolicy: 'network-only',
    variables: {},
    onCompleted: (sre) => {
      var dates = sre.tasks.map((item:any) => { return new Date(item.updatedAt) })
      console.log("datescompare",dates)
      var latest = new Date(Math.max.apply(null,dates))

      if(updatedAt.getFullYear() != latest.getFullYear()
      || updatedAt.getMonth() != latest.getMonth()
      || updatedAt.getDate() != latest.getDate()
      || updatedAt.getHours() != latest.getHours()
      || updatedAt.getMinutes() != latest.getMinutes()
      || updatedAt.getSeconds() != latest.getSeconds()
      || updatedAt.getMilliseconds() != latest.getMilliseconds()
      )
      {
        info()
      }else{
        tasks.map((t:any, index)=>{
          updateTaskPriority({variables : {
            taskId : t.id,
            priority : index+1
          }}).then(
            res => {
              console.log("Update task succes")
            }
            ,err => {
              console.log("Update task failed")
            }
          );
        })
        // newOrderingtasks.forEach(function(part, index, theArray) {
        //   // if(index > 0){
        //   //   console.log(theArray[index], index)
        //   // }
        // })
        history.push('/TaskView')
      }
    },
    onError: (err) => {
      window.alert(err)
    }
  });

  const {data: tasksData, loading: tasksLoading} = useQuery(GET_PENDING_TASKS,{
    // fetchPolicy: 'network-only',
    variables: {},
    onCompleted: (sre) => {
      setTasks(sre.tasks)
      var dates = sre.tasks.map((item:any) => { return new Date(item.updatedAt) })
      console.log("dates",dates)
      var latest = new Date(Math.max.apply(null,dates))
      setUpdatedAt(latest)
    },
    onError: (err) => {
      window.alert(err)
    }
  });
  const onCancel =(value : boolean)=>{
    if(value){
      window.location.reload()
    }
  }
  const info = () => {
    Modal.info({
      title: 'Alert',
      content: (
        <div>
          <p>สถานะรายการถูกเปลี่ยน กรุณาเลือกรายการที่ต้องการแก้ไขอีกครั้ง</p>
        </div>
      ),
      onOk() {
        window.location.reload(false);
      },
    });
  }

  const [updateTaskPriority, { error, loading, data }] = useMutation(UPDATE_TASK_PRIORITY)

  const [UpdateEditTask] = useMutation(UPDATE_EDIT_TASK)

  const updateTask = (taskId : string, taskName : string, total : number) => {
    setSetTask(!setTask)
    UpdateEditTask({variables : {
      taskId : taskId,
      name: taskName,
      total: total,
      }}).then(
      res => {
        console.log("update task succes")
        window.location.reload()
      }
      ,err => {
        console.log("update task failed")
      }
    );
  }

  const toggleEditTask = (taskId: string, taskName: string, total : number) => {
    const taskNameArr = taskName.split(/([0-9]+)/)
    const type = taskNameArr[0] && taskNameArr[0].trim() === "โต๊ะ" ? "T" : "Q"
    history.push('/SetTaskNew/'+taskId+'/'+taskNameArr[1]+'/'+total+'/'+type)
  }
    

  const save = () => {
    getTaksCompare() 
  }

  return (
    <>
    {
      tasksLoading || taskLazyLoading
      ? <Loadding />
      :
      <div style={{margin:"2em"}} className="relative">
        <Header username={userName? userName : ""} userRole={userRole? userRole : "CASHIER"} page="edit" toggleRole={() => {}} className=''></Header>
        <div className="flex justify-end items-center absolute top-0 right-0 z-10
          text-sm sm:text-lg md:text-lg lg:text-lg xl:text-lg">
          <a href="/TaskView?userRole=CASHIER" className="underline mr-4" style={{color:'#535050'}}>ยกเลิก</a>
          <div className="p-2 px-4 inline-block font-bold text-white" style={{background: '#683830',borderRadius:'5px'}} onClick={save}>บันทึก</div>
        </div>
        <ReactSortable
          list={tasks} 
          setList={setTasks}
          animation={200}
          className="flex flex-wrap"
        >
          {tasks.map((item:any) => (
          <div key={item.id} className="m-2 flex flex-wrap">
              <TaskNew taskId={item.id} taskName={item.name} total={item.total} userRole={"CASHIER"}
                status={item.status} finishDate={new Date(item.finishTime)} page="SortTask"
                cancel={onCancel} setTask={toggleEditTask} />                
            </div>
          ))}
        </ReactSortable>
      </div>
    }
    </>
  );
}

export default SortTask;
