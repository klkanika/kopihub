import React, {useState, useEffect} from 'react'
import {useQuery,useLazyQuery,useMutation} from '@apollo/react-hooks'
import {
  GET_PENDING_TASKS, UPDATE_TASK_PRIORITY
} from '../../utils/graphql';
import { ReactSortable } from "react-sortablejs";
import Task from './Task';
import { useSocket } from 'use-socketio';
import { Button, Modal } from 'antd';
import {useHistory} from "react-router-dom";
import Header from './Header';

function EditTask() {
  const history = useHistory()
  const [ tasks, setTasks] = useState([])
  const [ newOrderingtasks, setNewOrderingtasks] = useState<string[]>([])
  const userName = sessionStorage.getItem("loggedUserName");
  const userRole = sessionStorage.getItem("loggedUserRole");

  const { subscribe, unsubscribe } = useSocket("pendingTaskUpdate", (dataFromServer) =>
    getTaks()
  );

  useEffect(()=>{
    subscribe()
    return () =>{
      unsubscribe()
    }
  },[])

  const [getTaks , {called, loading : taskLazyLoading,data : taskLazyData}] = useLazyQuery(GET_PENDING_TASKS,{
    fetchPolicy: 'network-only',
    variables: {},
    onCompleted: (sre) => {
      info()
    },
    onError: (err) => {
      window.alert(err)
    }
  });

  const {data: tasksData, loading: tasksLoading} = useQuery(GET_PENDING_TASKS,{
    fetchPolicy: 'network-only',
    variables: {},
    onCompleted: (sre) => {
      setTasks(sre.tasks)
    },
    onError: (err) => {
      window.alert(err)
    }
  });

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

  const save = () => {
    newOrderingtasks.forEach(function(part, index, theArray) {
      if(index > 0){
        updateTaskPriority({variables : {
          taskId : theArray[index],
          priority : index
        }}).then(
          res => {
            console.log("Update task succes")
          }
          ,err => {
            console.log("Update task failed")
          }
        );
      }
    })
    history.push('/TaskView')
  }

  return (
    <div style={{margin:"2em"}} className="relative">
      <Header username={userName? userName : ""} userRole={userRole? userRole : "CASHIER"} page="edit" toggleRole={() => {}}></Header>
      <div className="flex justify-end items-center absolute top-0 right-0 z-10">
        <a href="/TaskView" className="underline mr-4" style={{color:'#535050'}}>ยกเลิก</a>
        <div className="p-2 px-4 inline-block font-bold text-white" style={{background: '#683830',borderRadius:'5px'}} onClick={save}>บันทึก</div>
      </div>
      <ReactSortable
        list={tasks} 
        setList={setTasks}
        animation={200}
        className="flex flex-wrap"
        onChange={(order, sortable, evt) => {
            var sortArray = sortable?.toArray();
            var newArray = [""];
            sortArray?.map(i => 
              newArray.push(i.toString())
            )
            setNewOrderingtasks(newArray)
          }
        }
      >
        {/* <div className="flex flex-wrap"> */}
        {tasks.map((item:any) => (
         <div key={item.id} className="m-2">
             <Task taskId={item.id} taskName={item.name} total={item.total} userRole={""}
               status={item.status} finishDate={new Date(item.finishTime)} page="EditTask"
               setTime={(taskId: string) => {}} timeUp={(taskId: string) => {}} toggleTimeUp={(taskId: string) => {}}/>
           </div>
        ))}
        {/* </div> */}
      </ReactSortable>
    </div>);
}

export default EditTask;
