import React, { Component, useState, useEffect } from 'react';
import { Modal, Input, Radio, message, Form, Button, TimePicker, Checkbox, Divider } from 'antd';
import {
    UPDATE_NOTIFICATION,GET_NOTIFICATION_BY_ID
} from '../../utils/graphql';
import {
  useMutation, useQuery
} from '@apollo/react-hooks'
import { useHistory, useParams } from "react-router-dom";
import moment from 'moment';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import Loadding from '../layout/loadding'


const EditAdmin = () => {
  const history = useHistory()
  const [message, setMessage] = useState("defaultMessage")
  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)
  const [token, setToken] = useState("defaultToken")
  const format = 'HH:mm';
  const plainOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const defaultCheckedList : any[] | (() => any[]) = [];
  const [checkedList, setCheckedList] = React.useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);
  const CheckboxGroup = Checkbox.Group;
  const {id} = useParams()


  const [UpdateAdmin] = useMutation(UPDATE_NOTIFICATION)

  const { data: notifyData, loading: loading} = useQuery (GET_NOTIFICATION_BY_ID,{
    fetchPolicy: 'network-only',
    variables: {
        id : id+""
    },
    onCompleted: (sre) => {  
        console.log("sre",sre)
        setMessage(sre.getNotificationById.message)
        setHour(sre.getNotificationById.hour)
        setMinute(sre.getNotificationById.minute)
        setToken(sre.getNotificationById.token)
        if(sre.getNotificationById.mon){
            checkedList.push('Mon')
        }
        if(sre.getNotificationById.tue){
            checkedList.push('Tue')
        }
        if(sre.getNotificationById.wed){
            checkedList.push('Wed')
        }
        if(sre.getNotificationById.thu){
            checkedList.push('Thu')
        }
        if(sre.getNotificationById.fri){
            checkedList.push('Fri')
        }
        if(sre.getNotificationById.sat){
            checkedList.push('Sat')
        }
        if(sre.getNotificationById.sun){
            checkedList.push('Sun')
        }
    },
    onError: (err) => {
        window.alert(err)
    }
    });
  

  const updateNotification = (message: string, hour: number, minute: number,token:string,Mon:string[],Tue:string[],Wed:string[],Thu:string[],Fri:string[],Sat:string[],Sun:string[]) => {
    UpdateAdmin({
      variables: {
        id: id+"",
        message: message,
        hour: hour,
        minute: minute,
        token: token,
        userId: sessionStorage.getItem("loggedUserId"),
        mon : Mon.length===0?false:true,
        tue : Tue.length===0?false:true,
        wed : Wed.length===0?false:true,
        thu : Thu.length===0?false:true,
        fri : Fri.length===0?false:true,
        sat : Sat.length===0?false:true,
        sun : Sun.length===0?false:true,
      }
    }).then(
      res => {
        window.alert('บันทึกข้อความแจ้งเตือนเรียบร้อยแล้ว!')
        history.push('/Admin')
        window.location.reload()
      }
      , err => {
        console.log("update notification failed")
      }
    );
  }

  const onFinish = async (values: any) => {
    if(!message || message === "" || message === "defaultMessage"){
      window.alert('กรุณาระบุข้อความให้ถูกต้อง')
    }
    else if(!hour || hour <= -1 || hour > 24){
      window.alert('กรุณาระบุเวลาแจ้งเตือนหน่วยชั่วโมง 0-24 ให้ถูกต้อง')
    }
    else if(!minute || minute <= -1 || minute > 60){
        window.alert('กรุณาระบุเวลาแจ้งเตือนหน่วยนาที 0-60 ให้ถูกต้อง')
    }
    else if(!token || token === "" || token === "defaultToken"){
        window.alert('กรุณาระบุ Token ให้ถูกต้อง')
    }
    else if(message && hour && minute && token && checkedList){
        const Mon = checkedList.filter((checkedList) => {
            return checkedList == "Mon"
        })
        const Tue = checkedList.filter((checkedList) => {
            return checkedList == "Tue"
        })
        const Wed = checkedList.filter((checkedList) => {
            return checkedList == "Wed"
        })
        const Thu = checkedList.filter((checkedList) => {
            return checkedList == "Thu"
        })
        const Fri = checkedList.filter((checkedList) => {
            return checkedList == "Fri"
        })
        const Sat = checkedList.filter((checkedList) => {
            return checkedList == "Sat"
        })
        const Sun = checkedList.filter((checkedList) => {
            return checkedList == "Sun"
        })

        updateNotification(
        message, 
        hour===24?0:hour, 
        minute===60?0:minute,
        token,
        Mon,
        Tue,
        Wed,
        Thu,
        Fri,
        Sat,
        Sun
        )
    }else{
      console.log('message && hour && minute && token', message && hour && minute && token)  
      window.alert('ข้อมูลไม่ถูกต้อง')
    }
  }

  function onChangeTime(time: any, timeString: any) {
    const hh = timeString.substring(0, 2);
    setHour(parseInt(hh))
    const mm = timeString.substring(3, 6);
    setMinute(parseInt(mm))
  }

  const onChange = (list : any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e : any) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  
  return (
    <>
    {
      !notifyData || loading ?
        <Loadding />
        :
    <div className="flex items-center justify-center " 
    style={{background: '#FFFCF9',width: '100vw',height: '100vh'}}>
      <div style={{border:'3px solid #683830',borderRadius:'10px'}}
        className="m-2 flex items-center justify-center 
          w-auto sm:w-auto md:w-1/2 lg:w-1/2 xl:w-1/2">
        <div className="w-3/4 sm:w-auto md:w-auto lg:w-auto xl:w-auto max-w-screen-md text-center">
          <div className="text-xl font-bold w-full text-center block underline mt-3"
            style={{ textAlign:'center', paddingBottom:'15px'}}>  แก้ไขข้อความแจ้งเตือนพนักงาน</div>
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
                defaultValue={notifyData.getNotificationById.message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div style={{ width: '33%',textAlign:'right', paddingRight:'15px'}}>เวลาที่จะแจ้งเตือน</div>
              <TimePicker 
                size="large"
                defaultValue={moment(notifyData.getNotificationById.hour+":"+notifyData.getNotificationById.minute, format)} 
                format={format} 
                style={{ width: '50%'}} 
                name="time"
                onChange={onChangeTime}
              />
              <div style={{ width: '33%',textAlign:'right', paddingRight:'15px'}}>Token</div>
                <Input
                size="large"
                type="text"
                style={{ width: '50%' }} 
                defaultValue={notifyData.getNotificationById.token}
                onChange={(e) => setToken(e.target.value)}
              />
              <Divider />
              <div style={{ width: '33%',textAlign:'right', paddingRight:'15px'}}>วันที่ต้องการส่งแจ้งเตือน </div>
              <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                 Everyday
              </Checkbox>
              <Divider />
              <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} /> 
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
              href="/Admin"
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
    }
   </>
  );
}

export default EditAdmin;
