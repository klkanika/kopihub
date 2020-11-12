import React, { Component } from 'react';
import { Modal, Input, message } from 'antd';
import Steamer from './Steamer';
import { isSelectionNode } from 'graphql';
import { strict } from 'assert';
import {useHistory, useParams} from "react-router-dom";
import {
  GET_STEAMER, UPDATE_TASK_COMPLETE, UPDATE_STEAMER_COMPLETE, UPDATE_STEAMER, UPDATE_TASK_ONGOING
} from '../../utils/graphql';
import {
  useQuery, useMutation
} from '@apollo/react-hooks'

let search = window.location.search;
let params = new URLSearchParams(search);
let id = params.get('id');
let status = params.get('status');
// interface ITimeProps {
//   taskId: string
//   closePopup: ((taskId : string) => void);
//   saveTime: ((taskId : string, time : number, selected : string[]) => void);
//   visible : boolean
//   status : string
//   updateComplete : ((taskId : string) => void)
//   steamer : []
// }
// interface ITimeState {
//   time: number
// }
// function onchange(value:any) {
//   console.log('changed', value);
// }

const SetTime = () => {
  const history = useHistory()
  let { id } = useParams()
  let { status } = useParams()
  let { finishDate } = useParams()

  const { data: steamerData, loading: steamerLoading } = useQuery(GET_STEAMER, {
    fetchPolicy: 'network-only',
    onCompleted: (sre) => {
    },
    onError: (err) => {
      window.alert(err)
    }
  });

  const steamer = (steamerData && steamerData.steamers) || []
  const newSelectedArray = [""]
  const verifyData = (taskId : string, time: number) => {
    if(newSelectedArray.filter(s => s === "").length > 0){
      var index = newSelectedArray.indexOf("")
      if (index !== -1) {
        newSelectedArray.splice(index, 1);
      }
    }

    if(newSelectedArray.length == 0 && status === "PENDING"){
      message.error("กรุณาระบุหลุม")
    }
    else if(time == -1){
      updateComplete(taskId)
    }
    else{
      updateFinishDate(taskId, time, newSelectedArray)
    }
  }

  const onchangeSelect = (steamerId : string, taskId : string, selected : boolean) =>{
    if(newSelectedArray.filter(s => s === "").length > 0){
      var index = newSelectedArray.indexOf("")
      if (index !== -1) {
        newSelectedArray.splice(index, 1);
      }
    }
    
    if(newSelectedArray.filter(s => s === steamerId).length > 0){
      var index = newSelectedArray.indexOf(steamerId)
      if (index !== -1) {
        newSelectedArray.splice(index, 1);
      }
    }else{
      newSelectedArray.push(steamerId)
    }
  }

  const checkEnabled = () =>{
    var count = steamer.filter((s : any) => s.taskId === id).length || 0
    return count == 0
  }

  const [UpdateTaskComplete] = useMutation(UPDATE_TASK_COMPLETE)
  const [UpdateSteamerComplete] = useMutation(UPDATE_STEAMER_COMPLETE)
  const updateComplete = (dbTaskId: string) => {
    UpdateTaskComplete({
      variables: {
        taskId: dbTaskId
      }
    }).then(
      res => {
      }
      , err => {
        console.log("Update task completed failed")
      }
    );

    UpdateSteamerComplete({
      variables: {
        taskId: dbTaskId
      }
    }).then(
      res => {
        history.push('/TaskView?userRole=CHEF')
      }
      , err => {
        console.log("Update steamer completed failed")
      }
    );
  }

  const [UpdateTaskOngoing] = useMutation(UPDATE_TASK_ONGOING)
  const [UpdateSteamer] = useMutation(UPDATE_STEAMER)
  const updateSteamer = (dbTaskId: string, selected: string[]) => {
    selected.map((t: string) => {
      UpdateSteamer({
        variables: {
          id: t,
          taskId: dbTaskId
        }
      }).then(
        res => {
        }
        , err => {
          console.log("Update steamer failed")
        }
      );
    })
  }
  const updateFinishDate = (dbTaskId: string, time: number, selected: string[]) => {
    var setFinishDate = new Date(); // get current 
    if (status == "ONGOING") {
      setFinishDate = new Date(finishDate);
    }
    setFinishDate.setHours(setFinishDate.getHours(), setFinishDate.getMinutes() + time, setFinishDate.getSeconds(), setFinishDate.getMilliseconds());
    updateSteamer(dbTaskId, selected)

    UpdateTaskOngoing({
      variables: {
        countTime: time,
        finishTime: setFinishDate,
        taskId: dbTaskId
      }
    }).then(
      res => {
        history.push('/TaskView?userRole=CHEF')
      }
      , err => {
        console.log("Update task failed")
      }
    );
  }
  
    return (
      <div className="flex items-center justify-center " 
        style={{background: '#FFFCF9',width: '100vw',height: '100vh'}}>
        <div style={{border:'3px solid #683830',borderRadius:'10px'}}
        className="m-2 flex items-center justify-center 
          w-auto sm:w-auto md:w-1/2 lg:w-1/2 xl:w-1/2">
          <div className="w-auto sm:w-auto md:w-auto lg:w-auto xl:w-auto max-w-screen-md text-center">            
            <table className="table-fixed">
              <tr>
                <td>
                <div className="flex text-xl font-bold w-full text-center underline mt-3 ml-2"
                  style={{ paddingBottom:'15px'}}>
                  <div style={{textAlign:'left'}}>{status === "ONGOING" || status === "TIMEUP" ? "เสิร์ฟอาหารหรือเพิ่มเวลา" : "จับเวลา"}</div>
                </div>
                </td>
                <td style={{textAlign:"right"}}>
                  <div className="font-thin text-base underline mr-4"><a 
                  href="/TaskView?userRole=CHEF"
                  style={{color: '#535050'}}
                  >
                    ยกเลิก
                  </a></div>
                </td>
              </tr>
              <tr>
                <td className="w-3/4 px-4 py-2" style={{borderRight : '1px solid #ddd'}}>
                  <div  className="grid grid-flow-col grid-cols-4 grid-rows-3 gap-4">
                  {
                    steamer.map( (item: any) => (
                      
                        <div key={item.id}>
                          <Steamer steamerId={item.id} 
                            selected={id === item.taskId}
                            taskId={item.taskId || ""}
                            select={onchangeSelect}
                            unavailable={item.taskId && item.taskId != id && status !== "COMPLETED"}
                            ownedTaskId={id}
                            enabled={checkEnabled()}
                            taskStatus={status}
                            // select={this.select} unselect={this.unselect}
                            />
                        </div>
                      
                    ))
                  }
                  </div>
                </td>
                <td className="w-1/4 px-2 py-0" >
                  <div className="flex flex-wrap">
                    <div className="px-2 py-2 m-1 font-bold text-base rounded-md w-full block text-center"
                      style={{border : '1px solid #683830',color: '#683830'}}           
                      onClick={() => {verifyData(id, 1);}}>1 min</div>
                    <div className="px-2 py-2 m-1 font-bold text-base rounded-md w-full block text-center" 
                      style={{border : '1px solid #683830',color: '#683830'}}   
                      onClick={() => {verifyData(id, 3);}}>3 min</div>
                    <div className="px-2 py-2 m-1 font-bold text-base rounded-md w-full block text-center"
                      style={{border : '1px solid #683830',color: '#683830'}}   
                      onClick={() => {verifyData(id, 5);}}>5 min</div>
                    <div className="px-2 py-2 m-1 font-bold text-base rounded-md w-full block text-center" 
                      style={{border : '1px solid #683830',color: '#683830'}}   
                      onClick={() => {verifyData(id, 7);}}>7 min</div>
                    <div className="px-2 py-2 m-1 font-bold text-base rounded-md w-full block text-center"
                      style={{border : '1px solid #683830',color: '#683830'}}   
                      onClick={() => {verifyData(id, 10);}}>10 min</div>
                    <div className="px-2 py-2 m-1 text-white font-bold text-base rounded-md w-full block text-center" 
                      style={{
                        display: status === "ONGOING" || status === "TIMEUP" ? "" : "none",
                        backgroundColor: '#DF2809'
                      }}
                      onClick={() => {
                        verifyData(id, -1);
                        }}>STOP</div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      // <Modal
      // visible={props.visible}
      // title={props.status === "ONGOING" || props.status === "TIMEUP" ? "เสิร์ฟอาหารหรือเพิ่มเวลา" : "จับเวลา"}
      // okButtonProps={{ style: { display: 'none' } }}
      // cancelText="ยกเลิก"
      // onCancel={() => props.closePopup("")}
      // >

      //   <table className="table-fixed">
      //     <tr>
      //       <td className="w-3/4 px-4 py-2" style={{borderRight : '1px solid #ddd'}}>
      //         <div  className="grid grid-flow-col grid-cols-4 grid-rows-3 gap-4">
              // {
              //   props.steamer.map( (item: any) => (
                  
              //       <div key={item.id}>
              //         <Steamer steamerId={item.id} 
              //           selected={props.taskId === item.taskId}
              //           taskId={item.taskId || ""}
              //           select={onchangeSelect}
              //           unavailable={item.taskId && item.taskId != props.taskId && props.status !== "COMPLETED"}
              //           ownedTaskId={props.taskId}
              //           enabled={checkEnabled()}
              //           taskStatus={props.status}
              //           // select={this.select} unselect={this.unselect}
              //           />
              //       </div>
                  
              //   ))
              // }
      //         </div>
      //       </td>
      //       <td className="w-1/4 px-2 py-0" >
      //         <div className="flex flex-wrap">
      //           <div className="px-2 py-2 m-1 font-bold text-base rounded-md w-full block text-center"
      //             style={{border : '1px solid #683830',color: '#683830'}}           
      //             onClick={() => {verifyData(props.taskId, 1);props.closePopup("")}}>1 min</div>
      //           <div className="px-2 py-2 m-1 font-bold text-base rounded-md w-full block text-center" 
      //             style={{border : '1px solid #683830',color: '#683830'}}   
      //             onClick={() => {verifyData(props.taskId, 3);props.closePopup("")}}>3 min</div>
      //           <div className="px-2 py-2 m-1 font-bold text-base rounded-md w-full block text-center"
      //             style={{border : '1px solid #683830',color: '#683830'}}   
      //             onClick={() => {verifyData(props.taskId, 5);props.closePopup("")}}>5 min</div>
      //           <div className="px-2 py-2 m-1 font-bold text-base rounded-md w-full block text-center" 
      //             style={{border : '1px solid #683830',color: '#683830'}}   
      //             onClick={() => {verifyData(props.taskId, 7);props.closePopup("")}}>7 min</div>
      //           <div className="px-2 py-2 m-1 font-bold text-base rounded-md w-full block text-center"
      //             style={{border : '1px solid #683830',color: '#683830'}}   
      //             onClick={() => {verifyData(props.taskId, 10);props.closePopup("")}}>10 min</div>
      //           <div className="px-2 py-2 m-1 text-white font-bold text-base rounded-md w-full block text-center" 
      //             style={{
      //               display: props.status === "ONGOING" || props.status === "TIMEUP" ? "" : "none",
      //               backgroundColor: '#DF2809'
      //             }}
      //             onClick={() => {verifyData(props.taskId, -1);props.closePopup("")}}>STOP</div>
      //         </div>
      //       </td>
      //     </tr>
      //   </table>
      // </Modal>
    
    )
}

export default SetTime;
