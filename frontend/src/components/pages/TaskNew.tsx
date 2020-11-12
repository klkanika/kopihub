import React, { useState,useEffect,useRef } from 'react';
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
  page : string
  cancel : ((value : boolean) => void)
  setTask : ((taskId : string, taskName : string, total : number) => void)
}

declare global {
  interface Window {
      playSound:any;
      pauseSound:any;
  }
}


function TaskNew (props : ITaskProps) { 

  var click = function handleClick  (){
    if(props.userRole === "CASHIER" && props.page === "EditTask"){
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
          cursor:"pointer",
          display: props.page == "EditTask" ? "" : "none"
        }}
      />
      </Popconfirm>
      <div 
        onClick={click}
        className="pt-2 overflow-hidden w-56 h-48 flex flex-wrap items-center bg-white"
        style={{border:'1px solid #ddd',borderRadius:'5px', cursor:"pointer"}}
      >
        <div className="w-1/2 pl-2 font-bold"> จำนวน {props.total} เข่ง</div>
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



export default TaskNew;
