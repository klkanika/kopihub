import React, { useState,useEffect,useRef } from 'react';
import Timer from './Timer';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import {
  UPDATE_TASK_CANCEL
} from '../../utils/graphql';
import {
  useMutation
} from '@apollo/react-hooks'

interface ITaskProps {
  taskId: string
  taskName: string
  total: number
  userRole : string
  status : string
  finishDate : Date
  setTime : ((taskId : string) => void)
  timeUp : ((taskId : string) => void)
  toggleTimeUp : ((taskId : string) => void)
  page : string
  cancel : ((value : boolean) => void)
  setTask : ((taskId : string, taskName : string, total : number) => void)
  setStatus : ((status : string) => void)
  setFinishDate : ((finishDate : Date) => void)
}

interface ITaskState {
}
declare global {
  interface Window {
      playSound:any;
      pauseSound:any;
  }
}


function Task (props : ITaskProps) { 
  let audio = new Audio("https://www.soundjay.com/button/beep-01a.mp3");
  const [ time, SetTime] = useState(0);
  
  // useInterval(() => {
  //   if (props.status === "ONGOING"){
  //     const difference = props.finishDate.valueOf() - Date.now().valueOf();
  //     if(difference <= 15000){
  //       SetTime(difference > 0 ? difference : 0)
  //       if(difference <= 0)
  //         props.timeUp(props.taskId)
  //     }
  //   }
  //   else if (props.userRole === "CHEF" && props.status === "TIMEUP"){
  //     try {
  //       window.playSound()  
  //     } catch (error) {
  //     }
  //   }else if (props.userRole === "CASHIER"){
  //     window.pauseSound()
  //   }
  //   //   window.playSound()
  // }, 2000);

  var click = function handleClick  (){
    if(props.userRole === "CHEF" && (props.status === "PENDING" || props.status === "ONGOING")){
      props.setFinishDate(props.finishDate)
      props.setStatus(props.status)
      props.setTime(props.taskId)
    }else if(props.userRole === "CHEF" && props.status === "TIMEUP")
    {
      props.setStatus(props.status)
      props.setTime(props.taskId)
      // props.toggleTimeUp(props.taskId) 
    }else if(props.userRole === "CASHIER"){
      props.setTask(props.taskId,props.taskName,props.total)
    }
  }
  const [UpdateTaskCancel] = useMutation(UPDATE_TASK_CANCEL)
  var confirm = function handleClick  (){
    UpdateTaskCancel({variables : {
      taskId : props.taskId}}).then(
        res => {
          props.cancel(true)
          console.log("Update task cancel succes")
        }
        ,err => {
          console.log("Update task cancel failed")
        }
      )
  }

  const statusColor = [
    {status : 'PENDING', color : 'green'},
    {status : 'TIMEUP', color : 'red'},
    {status : 'ONGOING', color : '#ddd'}
  ]

  return (
    <div className="relative">
      <Popconfirm
      title="ต้องการยกเลิกรายการนี้ใช่หรือไม่?"
      onConfirm={confirm}
      onCancel={()=>{}}
      okText="Yes"
      cancelText="No"
    >
      <CloseCircleOutlined 
        className="absolute bg-white"
        style={{
          fontSize: '30px',
          color:'red',
          right: '-5px',
          top: '-5px',
          display: props.page === "EditTask" ? "" : "none"
        }}
      />
      </Popconfirm>
      <div 
        onClick={click}
        className="pt-2 overflow-hidden w-48 flex flex-wrap items-center bg-white"
        style={{border:'1px solid #ddd',borderRadius:'5px'}}
      >
        <div className="w-1/2 pl-2 font-bold"> จำนวน {props.total} เข่ง</div>
        {/* <div className="w-1/2 text-right pr-2" style={{display: props.page === "EditTask" ? "none" : ""}}><Timer time={time} /></div> */}
        <div className="p-2 text-2xl font-bold w-full text-center">{props.taskName}</div>
        <div className="text-white font-bold p-2 w-full"
        style={{
          textAlign:"center",
          backgroundColor: statusColor.filter(c => c.status == props.status)[0].color 
        }}>{props.status}</div>
      </div>
    </div>
    )
}

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

export default Task;
