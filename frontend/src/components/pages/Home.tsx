import React, { useEffect } from 'react';
import {useHistory} from "react-router-dom";
import {
  useMutation
} from '@apollo/react-hooks'
import { Form, Input, Button, Checkbox, message  } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { LOGIN } from '../../utils/graphql';
// import { useSocket } from 'use-socketio';
import logo from '../../imgs/kopihub-logo.png'

interface loginInput {
  username: string;
  password: string;
}

const Home = () => {
  // const { subscribe, unsubscribe } = useSocket("hello", (dataFromServer) =>
  //   console.log(dataFromServer)
  // );
  // useEffect(()=>{
  //   subscribe()
  //   return ()=>{
  //     unsubscribe()
  //   }
  // },[])
  const history = useHistory()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };
  
  const [loggedUser, { error, loading, data }] = useMutation(LOGIN,{
    onCompleted: ((res) => {
      console.log("login succes",res)
      sessionStorage.setItem("loggedUserRole", res.login.role)
      sessionStorage.setItem("loggedId", res.login.id)
      sessionStorage.setItem("loggedStatus", "LOGGED_IN")
      sessionStorage.setItem("loggedUserId", res.login.userId)
      history.push('/SelectRole')  
    }),
    onError: ((err)=>{
      console.log("login failed",err)
      message.error('error')
      sessionStorage.clear()
    })
  })
  const onFinish = (value : loginInput) => {
    sessionStorage.setItem("loggedUserName", value.username) 
    loggedUser({
      variables: { 
        userName: value.username, 
        password:value.password 
      }
    })      
  }

  // sessionStorage.setItem("loggedStatus","NOT_LOGGED_IN")
  if(sessionStorage.getItem('loggedUserId')){
    history.push('/SelectRole') 
  }
  
  return (
    <div className="flex items-center justify-center" style={{background: '#FFFCF9',width: '100vw',height: '100vh'}}>
      <div className="w-3/4 max-w-screen-md text-center">
        <img src={logo} className="m-auto mb-8"></img>
        <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
          className="fiex justify-center"
        >
          <Input 
            prefix={<UserOutlined className="site-form-item-icon" />} 
            placeholder="Username"
            size="large"
            className="text-2xl"
            style={{borderRadius: '5px',fontSize: '22px'}}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          className="fiex justify-center"
        >
          <Input.Password 
            prefix={<LockOutlined className="site-form-item-icon" />} 
            placeholder="Password"
            size="large"
            style={{borderRadius: '5px',fontSize: '22px'}}
          />
        </Form.Item>

        {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <a href="">
            Forgot password
          </a>
        </Form.Item> */}

        <Form.Item {...tailLayout}>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="flex"
            style={{borderRadius: '5px',fontSize: '20px',height: 'auto',padding: '0.5em 3em',background:'#683830',border:'none'}}
          >
            LOGIN
          </Button>
          <br/>
          <a 
            href="./Register"
            className="block underline mt-3"
            style={{color: '#535050'}}
          >
            REGISTER
          </a>
        </Form.Item>
      </Form>
      </div>
    </div>

  );
}


export default Home;
