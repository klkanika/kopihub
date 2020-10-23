import React, { Component } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import {useHistory, Link} from "react-router-dom";
import icon_chef from '../../imgs/icon_chef.svg'
import icon_counter from '../../imgs/icon_counter.svg'
import { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_LOG_USER } from '../../utils/graphql';
import { UserSwitchOutlined, LogoutOutlined } from '@ant-design/icons';

interface IHeaderProps {
  username : string
  userRole : string
  page: string
  toggleRole: () => void
}

function Header(props : IHeaderProps) {
  const history = useHistory()
  const [ insertTask, setInsertTask ] = useState(false)
  const [UpdateLogUser] = useMutation(UPDATE_LOG_USER);
  
  const menu = (
    <Menu>
      <Menu.Item>
        <a 
          // href="/selectRole"
          onClick={props.toggleRole} 
          className="items-center"
          style={{borderBottom:'1px solid #ddd',padding:'1em 2em',fontSize:'16px',color:'#535050',display:'flex'}}
        >
          <UserSwitchOutlined style={{fontSize: '20px'}} className="mr-4"/>
          แก้ไขตำแหน่ง
        </a>
      </Menu.Item>
      <Menu.Item>
        <a href="/" 
          onClick={()=>{sessionStorage.clear();}}
          className="items-center"
          style={{padding:'1em 2em',fontSize:'16px',color:'#535050',display:'flex'}}
          >
          <LogoutOutlined style={{fontSize: '20px'}} className="mr-4"/>
          LOGOUT
        </a>
      </Menu.Item>
    </Menu>
  );
    console.log("render")
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <Dropdown overlay={menu} placement="bottomLeft" arrow className="z-50" trigger={['click']}>
          <div className="inline-block p-4 shadow mr-4"
            style={{border:'1px solid #ddd',borderRadius:'50%'}}
          >
            <img 
              src={props.userRole == 'CHEF'?icon_chef:icon_counter}
              width="30"
            />
          </div>
        </Dropdown>
        <div className="text-xl" style={{color:'#535050'}}>
          {props.userRole== 'CHEF'?'ครัว':'เคาน์เตอร์'} : {props.username}
        </div>
      </div>
      {/* <div></div> */}
      <div style={{display: (props.page == 'edit')?'none':''}}>
        <Link
          to="/EditTask"
          className="p-2 px-4 text-white font-bold text-lg"
          style={{
            borderRadius: '5px',
            background: '#683830',
            // display: "none",
            display: props.userRole === "CASHIER" ? "" : "none",
          }}>
          แก้ไขออเดอร์
        </Link>
      </div>
    </div>
  )
  
}

export default Header;
