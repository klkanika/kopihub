import React, { Component } from 'react';
import { Modal, Input, message } from 'antd';

interface ITimeProps {
  taskId: string
  closePopup: ((taskId : string) => void);
  saveTime: ((taskId : string, time : number) => void);
  visible : boolean
}
interface ITimeState {
  time: number
}
// function onchange(value:any) {
//   console.log('changed', value);
// }

class SetTime extends Component<ITimeProps, ITimeState> {
  state: ITimeState = {
    time: 8,
  };

  setTime(input : number){   
    this.setState({time: input});
  }
  // this.setTime(Number(e.target.value)

  verifyData(taskId : string, time: number){
    if(time <= 0){
      message.error('กรุณาระบุ เวลา')
    }
    else{
      this.props.saveTime(taskId, time)
    }
  }

  render(){
    return (
      <Modal
      visible={this.props.visible}
      title="จับเวลา"
      okButtonProps={{ style: { display: 'none' } }}
      // okText="เริ่มจับเวลา"
      cancelText="ยกเลิก"
      onCancel={() => this.props.closePopup("")}
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
        <div className="flex flex-wrap py-8">
          <div className="px-8 py-4 mr-2 bg-yellow-600 font-bold text-lg rounded-md" onClick={() => {this.verifyData(this.props.taskId, 1);this.props.closePopup("")}}>1</div>
          <div className="px-8 py-4 mr-2 bg-yellow-600 font-bold text-lg rounded-md" onClick={() => {this.verifyData(this.props.taskId, 3);this.props.closePopup("")}}>3</div>
          <div className="px-8 py-4 mr-2 bg-yellow-600 font-bold text-lg rounded-md" onClick={() => {this.verifyData(this.props.taskId, 5);this.props.closePopup("")}}>5</div>
          <div className="px-8 py-4 mr-2 bg-yellow-600 font-bold text-lg rounded-md" onClick={() => {this.verifyData(this.props.taskId, 8);this.props.closePopup("")}}>8</div>
          <div className="px-8 py-4 mr-2 bg-yellow-600 font-bold text-lg rounded-md" onClick={() => {this.verifyData(this.props.taskId, 10);this.props.closePopup("")}}>10</div>
        </div>
      </Modal>
    
    )
  }
}

export default SetTime;
