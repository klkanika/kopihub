import React, {useEffect} from 'react';
import { Button } from 'antd';
import {
  Redirect,
  useHistory
} from "react-router-dom";
import {
  UPDATE_LOG_USER
} from '../../utils/graphql';
import {
  useMutation,
} from '@apollo/react-hooks'
import icon_chef from '../../imgs/icon_chef.svg'
import icon_counter from '../../imgs/icon_counter.svg'
import icon_queue from '../../imgs/icon_queue.svg'

declare global {
  interface Window {
      playSound:any;
      pauseSound:any;
  }
}

function SelectRole() {
  window.pauseSound()
  const history = useHistory()
 
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

  return (
    <div className="flex items-center justify-center" style={{background: '#FFFCF9',width: '100vw',height: '100vh'}}>
      <div className="w-3/4 max-w-screen-md text-center">
        <Button onClick={() => saveValue('CASHIER')} name="CASHIER" value="CASHIER"
          className="shadow"
          style={{width: '300px',margin:'20px',borderRadius:'5px',padding:'20px',height:'auto', fontSize:'22px', fontWeight:'bold',color:'#683830',boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}
        >
          <img src={icon_counter} style={{height:'150px',margin:'0 auto 30px'}}/>
          เคาน์เตอร์
        </Button>
        <Button onClick={() => saveValue('CHEF')} name="CHEF" value="CHEF"
          className="shadow"
          style={{width: '300px',margin:'20px',borderRadius:'5px',padding:'20px',height:'auto', fontSize:'22px', fontWeight:'bold',color:'#683830',boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}
        >
          <img src={icon_chef} style={{height:'150px',margin:'0 auto 30px'}}/>
          ครัว
        </Button>
        <Button onClick={() => window.location.href = "/staffqueue"} name="STAFFQUEUE" value="STAFFQUEUE"
          className="shadow"
          style={{width: '300px',margin:'20px',borderRadius:'5px',padding:'20px',height:'auto', fontSize:'22px', fontWeight:'bold',color:'#683830',boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}
        >
          <img src={icon_queue} style={{height:'150px',margin:'0 auto 30px'}}/>
          คิว
        </Button>  
    </div>
   </div>
  )
}
export default SelectRole;
    


