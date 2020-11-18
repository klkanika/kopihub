import React, { Component, useState } from 'react';
import { Modal, Input, Radio, message, Form, Button, notification } from 'antd';
import {
  CREATE_TASK, CREATE_NOTIFICATION
} from '../../utils/graphql';
import {
  useMutation
} from '@apollo/react-hooks'
import { useHistory } from "react-router-dom";


const EditAdmin = () => {
  const history = useHistory()
  const [num, setNum] = useState(-1)
  const [message, setMessage] = useState("defaultMessage")
  const [hour, setHour] = useState(-1)
  const [minute, setMinute] = useState(-1)
  const [token, setToken] = useState("defaultToken")
//   const [nametype, setNameType] = useState("defaultNameType")

  const [CreateNotification, { error, loading, data }] = useMutation(CREATE_NOTIFICATION)

  const addNotification = (message: string, hour: number, minute: number,token:string) => {
    CreateNotification({
      variables: {
        message: message,
        hour: hour,
        minute: minute,
        token: token,
        userId: sessionStorage.getItem("loggedUserId")
      }
    }).then(
      res => {
        window.alert('บันทึกข้อความแจ้งเตือนเรียบร้อยแล้ว!')
        history.push('/Admin')
      }
      , err => {
        console.log("add notification failed")
      }
    );
  }
  
  const onFinish = () => {
      console.log("message",message)
      console.log("hour",hour)
      console.log("minute",minute)
    if(!message || message === "" || message === "defaultMessage"){
      window.alert('กรุณาระบุข้อความให้ถูกต้อง')
    }
    else if(!hour || hour <= -1 || hour > 24){
        console.log("!hour",!hour)
        console.log("hour <= -1",hour <= -1)
        console.log("hour > 24",hour > 24)
      window.alert('กรุณาระบุเวลาแจ้งเตือนหน่วยชั่วโมง 0-24 ให้ถูกต้อง')
    }
    else if(!minute || minute <= -1 || minute > 60){
        window.alert('กรุณาระบุเวลาแจ้งเตือนหน่วยนาที 0-60 ให้ถูกต้อง')
    }
    else if(!token || token === "" || token === "defaultToken"){
        window.alert('กรุณาระบุ Token ให้ถูกต้อง')
    }
    else if(message && hour && minute && token){
        // console.log("hour===24",hour===24)
        // if (hour===24){
        //     setHour(0)
        //     console.log("hour",hour)
        // }
        addNotification(
        message, 
        hour===24?0:hour, 
        minute===60?0:minute,
        token
        )
    }else{
      console.log('message && hour && minute && token', message && hour && minute && token)  
      window.alert('ข้อมูลไม่ถูกต้อง')
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
            style={{ textAlign:'center', paddingBottom:'15px'}}>เพิ่มข้อความแจ้งเตือนพนักงาน</div>
          <Form
          onFinish={onFinish}
          >       
            <Form.Item>
              <Input.Group compact>
              <div style={{ width: '33%',textAlign:'right', paddingRight:'15px'}}>ข้อความ</div>
              <Input
                size="large"
                type="text"
                style={{ width: '50%' }} 
                placeholder="ข้อความ" 
                onChange={(e) => setMessage(e.target.value)}
              />
              <div style={{ width: '33%',textAlign:'right', paddingRight:'15px'}}>เวลาที่จะแจ้งเตือน(ชั่วโมง)</div>
              <Input
                size="large"
                type="number"
                pattern="[0-9]*"
                style={{ width: '50%' }} 
                placeholder="ชั่วโมง" 
                onChange={(e) => setHour(parseInt(e.target.value))}
              />
              <div style={{ width: '33%',textAlign:'right', paddingRight:'15px'}}>เวลาที่จะแจ้งเตือน(นาที)</div>
                <Input
                size="large"
                type="number"
                pattern="[0-9]*"
                style={{ width: '50%' }} 
                placeholder="นาที" 
                onChange={(e) => setMinute(parseInt(e.target.value))}
              />
              <div style={{ width: '33%',textAlign:'right', paddingRight:'15px'}}>Token</div>
                <Input
                size="large"
                type="text"
                style={{ width: '50%' }} 
                placeholder="Token" 
                onChange={(e) => setToken(e.target.value)}
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
              href="/SelectRole"
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

export default EditAdmin;
