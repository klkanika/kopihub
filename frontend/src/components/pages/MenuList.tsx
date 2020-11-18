import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom'

const MenuList = () => {
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname)
  console.log('location',location.pathname);
  // render() {
    return (
      <Menu mode="horizontal"
      selectedKeys={[current]}
      >
        <Menu.Item key="/SelectRole">
          <a href="/SelectRole">
          หน้าหลัก
          </a>
        </Menu.Item>
        <Menu.Item key="/Admin">
          <a href="/Admin">
          ข้อมูลการแจ้งเตือน
          </a>
        </Menu.Item>
        <Menu.Item key="/NotifyLog">
          <a href="/NotifyLog">
          ข้อมูลประวัติการแจ้งเตือน
          </a>
        </Menu.Item>
        <Menu.Item key="/logout">
          <div onClick={() => {
            sessionStorage.clear()
            window.location.reload()
            }}>ออกจากระบบ</div>
        </Menu.Item>
      </Menu>
    );
  // }
}

export default MenuList;