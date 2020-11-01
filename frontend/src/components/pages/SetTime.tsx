import React, { Component } from 'react';
import { Modal, Input, message } from 'antd';
import Steamer from './Steamer';
import { isSelectionNode } from 'graphql';
import { strict } from 'assert';

interface ITimeProps {
  taskId: string
  closePopup: ((taskId : string) => void);
  saveTime: ((taskId : string, time : number, selected : string[]) => void);
  visible : boolean
  status : string
  updateComplete : ((taskId : string) => void)
  steamer : []
}
interface ITimeState {
  time: number
}
// function onchange(value:any) {
//   console.log('changed', value);
// }

function SetTime (props : ITimeProps) {
  const newSelectedArray = [""]
  const verifyData = (taskId : string, time: number) => {
    if(newSelectedArray.filter(s => s === "").length > 0){
      var index = newSelectedArray.indexOf("")
      if (index !== -1) {
        newSelectedArray.splice(index, 1);
      }
    }

    if(newSelectedArray.length == 0 && props.status === "PENDING"){
      message.error("กรุณาระบุหลุม")
    }
    else if(time == -1){
      props.updateComplete(taskId)
    }
    else{
      props.saveTime(taskId, time, newSelectedArray)
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
    // console.log(newSelectedArray)
    // console.log(props.taskId)
    // props.select(steamerId, taskId, selected)
  }

  const checkEnabled = () =>{
    var count = props.steamer.filter((s : any) => s.taskId === props.taskId).length || 0
    return count == 0
  }
  
    return (
      <Modal
      visible={props.visible}
      title={props.status === "ONGOING" || props.status === "TIMEUP" ? "เสิร์ฟอาหารหรือเพิ่มเวลา" : "จับเวลา"}
      okButtonProps={{ style: { display: 'none' } }}
      // okText="เริ่มจับเวลา"
      cancelText="ยกเลิก"
      onCancel={() => props.closePopup("")}
      // onOk={() => this.verifyData(this.props.taskId, this.state.time)}
      >
        {/* <InputNumber  style={{ width: '90%' }} placeholder="จับเวลา" onChange={onchange}/> */}
        {/* <Input
          size="large"
          type="number"
          placeholder="จับเวลา"
          defaultValue={this.state.time}
          onChange={(e) => this.setTime(Number(e.target.value))}
        /> */}
        <table style={{width:'99%'}}>
          <tr>
            <td style={{width:'70%'}}>
              <div  className="grid grid-flow-col grid-cols-4 grid-rows-3 gap-4">
              {
                props.steamer.map( (item: any) => (
                  
                    <div key={item.id}>
                      <Steamer steamerId={item.id} 
                        selected={props.taskId === item.taskId}
                        taskId={item.taskId || ""}
                        select={onchangeSelect}
                        unavailable={item.taskId && item.taskId != props.taskId && props.status !== "COMPLETED"}
                        ownedTaskId={props.taskId}
                        enabled={checkEnabled()}
                        taskStatus={props.status}
                        // select={this.select} unselect={this.unselect}
                        />
                    </div>
                  
                ))
              }
              </div>
            </td>
            <td style={{width:'30%'}}>
              <div className="flex flex-wrap">
                <div className="px-5 py-2 m-1 bg-yellow-600 font-bold text-lg rounded-md"
                  onClick={() => {verifyData(props.taskId, 1);props.closePopup("")}}>1</div>
                <div className="px-5 py-2 m-1 bg-yellow-600 font-bold text-lg rounded-md" 
                  onClick={() => {verifyData(props.taskId, 3);props.closePopup("")}}>3</div>
                <div className="px-5 py-2 m-1 bg-yellow-600 font-bold text-lg rounded-md"
                  onClick={() => {verifyData(props.taskId, 5);props.closePopup("")}}>5</div>
                <div className="px-5 py-2 m-1 bg-yellow-600 font-bold text-lg rounded-md" 
                  onClick={() => {verifyData(props.taskId, 7);props.closePopup("")}}>7</div>
                <div className="px-5 py-2 m-1 bg-yellow-600 font-bold text-lg rounded-md"
                  onClick={() => {verifyData(props.taskId, 10);props.closePopup("")}}>10</div>
                <div className="px-5 py-2 m-1 bg-orange-600 font-bold text-lg rounded-md" 
                  style={{display: props.status === "ONGOING" || props.status === "TIMEUP" ? "" : "none"}}
                  onClick={() => {verifyData(props.taskId, -1);props.closePopup("")}}>STOP</div>
              </div>
            </td>
          </tr>
        </table>
      </Modal>
    
    )
}

export default SetTime;
