import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import {
  useQuery,
  useApolloClient,
  useSubscription,
  useLazyQuery,
  useMutation,
} from '@apollo/react-hooks'
import { Form, Input, Button, Checkbox, Table, Spin } from 'antd';
import { SearchOutlined, CheckSquareOutlined } from '@ant-design/icons';
import liffHelper from '../../utils/liffHelper';
import { EditOutlined, CheckCircleOutlined,UploadOutlined, CheckOutlined, PictureTwoTone } from '@ant-design/icons';
import { ALL_NOTIFICATION } from '../../utils/graphql';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment';
import MenuList from './MenuList'

const Admin = () => {
  const history = useHistory()
  const [filterTable, setFilterTable] = useState(null);

  const { data , loading : loading } = useQuery(ALL_NOTIFICATION, {
    onCompleted: (sre) => {
      console.log(data)
      console.log(data.notifications)
    },
    onError: (err) => {
      window.alert(err)
    }
  });

  const dataSource = data && data.notifications
  .map((ds: any, index: any) => {
    console.log("ds",ds)
    return {
      key: index+1,
      ...ds,
    }
  });
   

  dataSource && dataSource.sort((a: any, b: any) => {
    return a.updatedAt > b.updatedAt
  });

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      sorter : (a : any) => a.key,
    },
    {
      title: 'message',
      dataIndex: 'message',
      key: 'message',
      sorter : (a : any ,b : any ) => a.message.localeCompare(b.message),
    },
    {
      title: 'hour',
      dataIndex: 'hour',
      key: 'hour',
      sorter : (a : any ,b : any ) => a.hour - (b.hour),
    },
    {
      title: 'minute',
      dataIndex: 'minute',
      key: 'minute',
      sorter : (a : any ,b : any ) => a.minute - (b.minute),
    },
    {
      title: 'token',
      dataIndex: 'token',
      key: 'token',
      sorter : (a : any ,b : any ) => a.token.localeCompare(b.token),
    },
    {
      title: 'แก้ไข',
      key: 'edited',
      render: (record: any) => {
        return (
          <div className="text-center">
            <Button type="primary" icon={<EditOutlined />} onClick={() => { 
              history.push('/EditAdmin/'+record.id)
            }}/>
          </div>
        );
      }
    },
  ]

  return (
    <div>
      <MenuList/>
      <Spin spinning={loading}>
        <title>ข้อมูลการแจ้งเตือน</title>
        <div style={{ margin: '3rem' }}>
          <div className="flex items-center justify-between mt-8 mb-8">
            <p className="w-1/2" style={{ fontSize: '1.8em', fontWeight: 'bold' }}>ข้อมูลการแจ้งเตือน</p>
          </div>
          <Table dataSource={filterTable == null ? dataSource : filterTable} columns={columns} bordered size="middle" />
        </div>
      </Spin>
      <div className="flex items-center justify-center">
      <Button
        type="primary"
        htmlType="submit"
        className="flex justify-center"
        style={{borderRadius: '5px',fontSize: '20px',height: 'auto',padding: '0.5em 3em',background:'#683830'
        ,border:'none',width: '30%'}}
        onClick={() => { 
          history.push('/InsertAdmin/')
        }}
      >
        เพิ่มข้อความการแจ้งเตือนใหม่
      </Button>
      </div>
    </div>
  )
}

export default Admin;
