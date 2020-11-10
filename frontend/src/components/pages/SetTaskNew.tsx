import React, {useState, useEffect, useRef, Component} from 'react'
import {useQuery,useLazyQuery,useMutation} from '@apollo/react-hooks'
import { UPDATE_EDIT_TASK } from '../../utils/graphql';
import { Button, Modal, Form, Input, Radio, message } from 'antd';
import {useHistory, useParams} from "react-router-dom";
import { EditOutlined  } from '@ant-design/icons';

let search = window.location.search;
let params = new URLSearchParams(search);
let id = params.get('id');
let taskName = params.get('taskName');
let total = params.get('total');
let type = params.get('type');

interface inputForm {
  num: number;
  name: string;
}

const SetTaskNew = () => {
  const history = useHistory()
  let { id } = useParams()
  let { taskName } = useParams()
  let { total } = useParams()
  let { type } = useParams()
  const [num,setNum] = useState(-1)
  const [name,setName] = useState("defaultName")
  const [nametype,setNameType] = useState("defaultNameType")
  const [change,setChange] = useState(false)



  const options = [
    { label: 'คิว', value: 'Q' },
    { label: 'โต๊ะ', value: 'T' }
  ];

  const [UpdateEditTask] = useMutation(UPDATE_EDIT_TASK)
  const updateTask = (taskId : string, taskName : string, total : number) => {
    UpdateEditTask({variables : {
      taskId : taskId,
      name: taskName,
      total: total,
      }}).then(
      res => {
        history.push('/EditTask?userRole=CASHIER')
      }
      ,err => {
        console.log("update task failed")
      }
    );
  }

  const onFinish = () => {
    if((!name || name === "")){
      message.error('กรุณาเปลี่ยนแปลง เลขโต๊ะ, เลขคิว ให้ถูกต้อง')
    }
    else if((!num || num == 0)){
      message.error('กรุณาเปลี่ยนแปลง จำนวนเข่ง ให้ถูกต้อง')
    }
    else if((name === "defaultName" || name === taskName) && (num <= -1 || num === parseInt(total))){
      message.error('กรุณาเปลี่ยนแปลง เลขโต๊ะ, เลขคิว หรือ จำนวนเข่ง ให้ถูกต้อง')
    }else if(id && name && num){
      updateTask(id
        , (nametype === "defaultNameType" ? type : nametype) +  (name === "defaultName" ? taskName : name)
        , num === -1 ? parseInt(total) : num
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
          <div className="w-3/4 sm:w-auto md:w-auto lg:w-auto xl:w-auto max-w-screen-md text-center"
        >
        <div className="text-xl font-bold w-full text-center block underline mt-3"
          style={{ textAlign:'left', paddingBottom:'15px'}}>เพิ่ม/แก้ไขออเดอร์</div>
        <Form
        onFinish={onFinish}
        >      
          <Form.Item>
            <Input.Group compact>
              <Radio.Group
                size="large"
                options={options}
                onChange={(e) => setNameType(e.target.value)}
                defaultValue={type}
                optionType="button"
                buttonStyle="solid"
                style={{ width: '50%',textAlign:'right', paddingRight:'15px'}}
              />
              <Input 
                size="large"
                type="number"
                pattern="[0-9]*"
                style={{ width: '50%' }} 
                defaultValue = {taskName}
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
              defaultValue = {total}
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
            href="/EditTask?userRole=CASHIER"
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
export default SetTaskNew;
