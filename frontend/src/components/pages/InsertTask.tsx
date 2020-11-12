import React, { Component, useState } from 'react';
import { Modal, Input, Radio, message, Form, Button } from 'antd';
import {
  CREATE_TASK
} from '../../utils/graphql';
import {
  useMutation
} from '@apollo/react-hooks'
import { useHistory } from "react-router-dom";

interface ITaskProps {
  closePopup: (() => void)
  addTask: ((taskName : string, total : number) => void)
  visible : boolean
}

interface ITaskState {
  taskName: string
  total: number
  taskType: string
}

const options = [
  { label: 'คิว', value: 'Q' },
  { label: 'โต๊ะ', value: 'T' }
];

const InsertTask = () => {
  const history = useHistory()
  const [num, setNum] = useState(-1)
  const [name, setName] = useState("defaultName")
  const [nametype, setNameType] = useState("defaultNameType")
  const [change, setChange] = useState(false)
    
  // verifyData(taskName : string, total: number){
  //   console.log(taskName)
  //   if(taskName === ""){
  //     message.error('กรุณาระบุ เลขโต๊ะหรือเลขคิว')
  //   }else if(total === 0){
  //     message.error('กรุณาระบุ จำนวนเข่ง')
  //   }else{
  //     this.props.addTask(this.getTaskName(), total)
  //   }
  // }

  const [CreateTask, { error, loading, data }] = useMutation(CREATE_TASK)

  const addTask = (taskName: string, total: number) => {
    CreateTask({
      variables: {
        name: taskName,
        total: total,
        finishTime: new Date(),
        countTime: 0,
        userId: sessionStorage.getItem("loggedUserId")
      }
    }).then(
      res => {
        history.push('/TaskView?userRole=CASHIER')
      }
      , err => {
        console.log("add task failed")
      }
    );
  }
  
  const onFinish = () => {
    if((!name || name === "" || name === "defaultName")){
      message.error('กรุณาระบุ เลขโต๊ะ, เลขคิว ให้ถูกต้อง')
    }
    else if((!num || num == 0 || num <= -1)){
      message.error('กรุณาระบุ จำนวนเข่ง ให้ถูกต้อง')
    }
    else if(!nametype || nametype === "" || nametype === "defaultNameType"){
      message.error('กรุณาระบุ คิวหรือโต๊ะ')
    }
    else if(name && num){
      var task = (nametype === "T" ? "โต๊ะ " : "คิว ") +  name
      addTask(
        task
        , num
        )
    }else{
      message.error('ข้อมูลไม่ถูกต้อง')
    }
  }

  return (
    <div className="flex items-center justify-center " 
    style={{background: '#FFFCF9',width: '100vw',height: '100vh'}}>
      <div style={{border:'3px solid #683830',borderRadius:'10px'}}
        className="m-2 flex items-center justify-center 
          w-auto sm:w-auto md:w-1/2 lg:w-1/2 xl:w-1/2">
        <div className="w-3/4 sm:w-auto md:w-auto lg:w-auto xl:w-auto max-w-screen-md text-center">
          <div className="text-xl font-bold w-full text-center block underline mt-3"
            style={{ textAlign:'left', paddingBottom:'15px'}}>เพิ่มออเดอร์</div>
          <Form
          onFinish={onFinish}
          >      
            <Form.Item>
              <Input.Group compact>
                <Radio.Group
                  size="large"
                  options={options}
                  onChange={(e) => setNameType(e.target.value)}
                  optionType="button"
                  buttonStyle="solid"
                  style={{ width: '50%',textAlign:'right', paddingRight:'15px'}}
                />
                <Input 
                  size="large"
                  type="number"
                  pattern="[0-9]*"
                  style={{ width: '50%' }} 
                  placeholder="เลขโต๊ะหรือเลขคิว" 
                  inputMode="decimal"
                  onChange={(e) => setName(e.target.value)}
                />
              </Input.Group>
            </Form.Item>  
            <Form.Item>
              <Input.Group compact>
              <div style={{ width: '50%',textAlign:'right', paddingRight:'15px'}}>จำนวนเข่ง</div>
              <Input
                size="large"
                type="number"
                pattern="[0-9]*"
                style={{ width: '50%' }} 
                placeholder="จำนวนเข่ง" 
                inputMode="decimal"
                onChange={(e) => setNum(parseInt(e.target.value))}
              />
            </Input.Group>
          </Form.Item>
          <Form.Item
            className="fiex justify-center"
            >
            <Button
                type="primary"
                htmlType="submit"
                className="flex justify-center"
                style={{borderRadius: '5px',fontSize: '20px',height: 'auto',padding: '0.5em 3em',background:'#683830'
                ,border:'none',width: '100%'}}
              >
                บันทึก
            </Button>
            <br/>
            <a 
              href="/TaskView?userRole=CASHIER"
              className="block underline mt-3"
              style={{color: '#535050'}}
            >
              ยกเลิก
            </a>
            </Form.Item>
            </Form>
        </div>
      </div>
    </div>
  
  );
}

export default InsertTask;
