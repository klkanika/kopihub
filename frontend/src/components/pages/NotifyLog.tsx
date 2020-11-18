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
import { GET_ALL_NOTIFY_LOG } from '../../utils/graphql';
import MenuList from './MenuList'


const NotifyLog = () => {
  const history = useHistory()
  const [filterTable, setFilterTable] = useState(null);

  const { data , loading : allCustomerLoading } = useQuery(GET_ALL_NOTIFY_LOG, {
    onCompleted: (sre) => {
      console.log(data)
    },
    onError: (err) => {
      window.alert(err)
    }
  });

  const dataSource = data && data.getAllNotifyLog && data.getAllNotifyLog.data
    .map((ds: any, index: any) => {
      console.log(ds)
      return {
        key: index+1,
        ...ds,
      }
    });

  dataSource && dataSource.sort((a: any, b: any) => {
    return a.createdAt > b.createdAt
  });

  const columns = [
    {
      title: 'วัน/เวลา ที่แจ้งเตือน',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter : (a : any ,b : any ) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: 'Log ID',
      dataIndex: 'id',
      key: 'id',
      sorter : (a : any ,b : any ) => a.id.localeCompare(b.id),
    },
    {
      title: 'ข้อความ',
      dataIndex: 'message',
      key: 'message',
      sorter : (a : any ,b : any ) => a.message.localeCompare(b.message),
    },
    
  ]
  //Search
  const filterSomeColumn = (o:any, k:any, value:any) => {
    return k === "createdAt" || k === "id" || k === "message"
            ?
            String(o[k])
            .toLowerCase()
            .includes(value.toLowerCase())
            : false
  }
  const onSearch = (value : any) => {
    const baseData = dataSource;
    if(baseData){
      const filterTable = baseData.filter((o:any) =>
        Object.keys(o).some(
          k => 
          filterSomeColumn(o,k,value)
        )
      );
      setFilterTable(filterTable)
    }   
  };

  return (
    <div>
      <MenuList/>
      <Spin spinning={allCustomerLoading}>
        <title>Notify Log</title>
        <div style={{ margin: '3rem' }}>
          <div className="flex items-center justify-between mt-8 mb-12">
            <p className="w-1/2" style={{ fontSize: '1.8em', fontWeight: 'bold' }}>ประวัติการส่งข้อความ</p>
            <Input.Search
                placeholder="Search"
                enterButton
                onSearch={onSearch}
                className="w-1/2"
                // white-space: nowrap;
              />
          </div>
          <Table dataSource={filterTable == null ? dataSource : filterTable} columns={columns} bordered size="middle" />
        </div>
      </Spin>
    </div>
  )
}

export default NotifyLog;
