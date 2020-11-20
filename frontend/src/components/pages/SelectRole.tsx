import React, {useEffect, useState} from 'react';
import { Button } from 'antd';
import {
  Redirect,
  useHistory
} from "react-router-dom";
import {
  UPDATE_LOG_USER,CHECK_ADMIN
} from '../../utils/graphql';
import {
  useMutation, useQuery,
} from '@apollo/react-hooks'
import icon_chef from '../../imgs/icon_chef.svg'
import icon_counter from '../../imgs/icon_counter.svg'
import icon_queue from '../../imgs/icon_queue.svg'
import icon_admin from '../../imgs/icon-admin.svg'
import icon_logout from '../../imgs/icon_logout.svg'

declare global {
  interface Window {
      playSound:any;
      pauseSound:any;
  }
}

function SelectRole() {
  window.pauseSound()
  const history = useHistory()
  const [admin, setAdmin] = useState("")
 
  const saveValue = (value: any) => {
        UpdateLogUser({variables : 
        {role: value
        ,id : sessionStorage.getItem("loggedId")}})
        .then(
          res => {console.log('success')
                 console.log(value)
                 sessionStorage.setItem("loggedUserRole",value)
                 history.push('/TaskView')},
          err => console.log('error')
        )  
  }

  useEffect(() => {
    // Update the document title using the browser API
    console.log('loggedStatus:'+sessionStorage.getItem("loggedStatus")
            +",loggedUserRole:"+sessionStorage.getItem("loggedUserRole")
            +",loggedId:"+sessionStorage.getItem("loggedId")
            +",loggedUserId:"+sessionStorage.getItem("loggedUserId")
            );
  });

  const [UpdateLogUser] = useMutation(UPDATE_LOG_USER)

  const { data: Data, loading: Loading } = useQuery(CHECK_ADMIN, {
    fetchPolicy: 'network-only',
    variables: {
      id : sessionStorage.getItem("loggedUserId")
    },
    onCompleted: (sre) => {
      if(sre.checkAdmin.is_admin == true)
        sessionStorage.setItem("loggedIsAdmin", 'Y')
      setAdmin(sre.checkAdmin.is_admin)
    },
    onError: (err) => {
      window.alert(err)
    }
  });

  return (
    <div className="flex items-center justify-center" style={{background: '#FFFCF9',width: '100vw',height: '100vh'}}>
      <div className="text-center
        block sm:block md:flex lg:flex xl:flex
        max-w-full
        max-h-full sm:max-h-screen md:max-h-full lg:max-h-screen xl:max-h-full">
        <Button onClick={() => saveValue('CASHIER')} name="CASHIER" value="CASHIER"
          className="shadow"
          style={{width: '300px',margin:'20px',borderRadius:'5px',padding:'20px',height:'auto', fontSize:'22px', fontWeight:'bold',color:'#683830'
          ,boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}
        >
          <img src={icon_counter} style={{height:'150px',margin:'0 auto 30px'}}/>
          เคาน์เตอร์
        </Button>
        <Button onClick={() => saveValue('CHEF')} name="CHEF" value="CHEF"
          className="shadow"
          style={{width: '300px',margin:'20px',borderRadius:'5px',padding:'20px',height:'auto', fontSize:'22px', fontWeight:'bold',color:'#683830'
          ,boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}
        >
          <img src={icon_chef} style={{height:'150px',margin:'0 auto 30px'}}/>
          ครัว
        </Button>
        <Button onClick={() => window.location.href = "/staffqueue"} name="STAFFQUEUE" value="STAFFQUEUE"
          className="shadow"
          style={{width: '300px',margin:'20px',borderRadius:'5px',padding:'20px',height:'auto', fontSize:'22px', fontWeight:'bold',color:'#683830'
            ,boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}
        >
          <img src={icon_queue} style={{height:'150px',margin:'0 auto 30px'}}/>
          คิว
        </Button>  
        {admin &&
        <Button onClick={() => window.location.href = "/admin"} name="ADMIN" value="ADMIN"
          className="shadow"
          style={{width: '300px',margin:'20px',borderRadius:'5px',padding:'20px',height:'auto', fontSize:'22px', fontWeight:'bold',color:'#683830'
            ,boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}
        >
          <img src={icon_admin} style={{height:'150px',margin:'0 auto 30px'}}/>
          Admin
        </Button> 
        }
        <Button onClick={() => {
          sessionStorage.clear()
            window.location.reload()}} name="LOGOUT" value="LOGOUT"
          className="shadow"
          style={{width: '300px',margin:'20px',borderRadius:'5px',padding:'20px',height:'auto', fontSize:'22px', fontWeight:'bold',color:'#683830'
            ,boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}
        >
          <img src={icon_logout} style={{height:'150px',margin:'0 auto 30px'}}/>
          LOGOUT
        </Button> 
        }
    </div>
   </div>
  )
}
export default SelectRole;
    


