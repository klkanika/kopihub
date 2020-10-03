import React from 'react';
import {useHistory} from "react-router-dom";
import {
  useMutation,
} from '@apollo/react-hooks'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {
  CREATE_USER1, LOGIN
} from '../../utils/graphql';

interface newUser {
  username: string;
  password: string;
  confirm: string;
}

const Register = () => {
  const history = useHistory()
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
  };
  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  const onFinish = (value : newUser) => {
    createUser({variables : {name: value.username
      ,userName:value.username
      ,password:value.password}})
      .then(
        res => {
          login(value.username,value.password)
        },
        err => message.error('error')
      )

      form.resetFields()
  }

  const login = (user : string, pass: string) => {
    loggedUser({ variables: { userName: user, password:pass } }).then(
      res => {
        console.log("login succes")
        sessionStorage.setItem("loggedUserRole", res.data.login.role)
        sessionStorage.setItem("loggedId", res.data.login.id)
        sessionStorage.setItem("loggedStatus", "LOGGED_IN")
        sessionStorage.setItem("loggedUserId", res.data.login.userId)
        sessionStorage.setItem("loggedUserName", user) 
        history.push('/SelectRole')              
      }
      ,err => {
        console.log("login failed")
        message.error('error')
      }
    ) 
  }
  const [loggedUser, { error, loading, data }] = useMutation(LOGIN)
  const [createUser] = useMutation(CREATE_USER1)

  return (
    <div className="flex items-center justify-center" style={{background: '#FFFCF9',width: '100vw',height: '100vh'}}>
      <div className="w-3/4 max-w-screen-md text-center">
        <div
          className="text-4xl font-bold mb-8"
          style={{color: '#683830'}}
        >REGISTER</div>
        <Form
        {...layout}
        form={form}
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
          hasFeedback
        >
          <Input.Password 
            prefix={<LockOutlined className="site-form-item-icon" />} 
            placeholder="Password"
            size="large"
            style={{borderRadius: '5px',fontSize: '22px'}}
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          className="fiex justify-center"
          rules={[{ required: true, message: 'Please input your password!' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('The two passwords that you entered do not match!');
              },
            })
          ]}
          hasFeedback
        >
          <Input.Password 
            prefix={<LockOutlined className="site-form-item-icon" />} 
            placeholder="Confirm Password"
            size="large"
            style={{borderRadius: '5px',fontSize: '22px'}}
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="flex"
            style={{borderRadius: '5px',fontSize: '20px',height: 'auto',padding: '0.5em 3em',background:'#683830',border:'none'}}
          >
            REGISTER
          </Button>
          <br/>
          <a href="./"
            className="block underline mt-3"
            style={{color: '#535050'}}
          >
            LOGIN
          </a>
        </Form.Item>
      </Form>
      </div>
    </div>

  );
}


export default Register;
