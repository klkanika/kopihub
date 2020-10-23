import React, { Component } from 'react';
import { Modal, Input, message, Radio } from 'antd';

interface ITimeProps {
  taskId: string
  total : number
  taskName : string
  closePopup: ((taskId : string, taskName : string , total : number) => void);
  saveEditTask: ((taskId : string, taskName : string, total : number) => void);
  typeTaskName : string
  noTaskName : string
  visible : boolean
}
interface ITimeState {
  taskName : string
  total: number
  taskType: string
}

const options = [
    { label: 'คิว', value: 'Q' },
    { label: 'โต๊ะ', value: 'T' }
  ];

class SetTask extends Component<ITimeProps, ITimeState> {
  state: ITimeState = {
    taskName: this.props.noTaskName,
    total: this.props.total,
    taskType: (this.props.typeTaskName == 'คิว') ? 'Q':'T',  
  };

  setTaskType(input : string){
    this.setState({ taskType: input })
  }

  setTaskName(input : string){
    this.setState({ taskName: input })
  }

  setTotal(input : number){
    if(input > 0)
      this.setState({ total: input })
  }

  getTaskName(){
    if(this.state.taskType === "T")
      return "โต๊ะ " + this.state.taskName
    else
      return "คิว " + this.state.taskName
  }

  verifyData(taskId : string, total: number, taskName: string){
    console.log(this.props.typeTaskName)
    if(this.getTaskName() === this.props.taskName && total === this.props.total){
      message.error('กรุณาเปลี่ยนแปลง เลขโต๊ะ, เลขคิว หรือ จำนวนเข่ง')
    }else{
      this.props.saveEditTask(taskId,this.getTaskName(),total)
    }
  }

  render(){
    return (
      <Modal
      visible={this.props.visible}
      title="แก้ไขออเดอร์"
      okText="บันทึก"
      cancelText="ยกเลิก"
      onCancel={() => this.props.closePopup(this.props.taskId,this.props.taskName,this.props.total)}
      onOk={() => this.verifyData(this.props.taskId, this.state.total, this.state.taskName)}
      >
        <Input.Group compact style={{marginBottom:'15px'}}>
          <Radio.Group
            size="large"
            options={options}
            onChange={(e) => this.setTaskType(e.target.value)}
            value={this.state.taskType}
            optionType="button"
            buttonStyle="solid"
            style={{ width: '40%',textAlign:'right', paddingRight:'15px'}}
          />
          <Input 
            size="large"
            type="number"
            pattern="[0-9]*"
            style={{ width: '60%' }} 
            defaultValue = {this.state.taskName}
            placeholder="เลขโต๊ะหรือเลขคิว" 
            inputMode="decimal"
            onChange={(e) => this.setTaskName(e.target.value)}
          />
        </Input.Group>
        <Input.Group compact style={{display:'flex',alignItems:'center'}}>
          <div style={{ width: '40%', textAlign:'right', paddingRight:'15px', fontSize:'1.5em'}}>จำนวนเข่ง</div>
          <Input
            size="large"
            type="number"
            pattern="[0-9]*"
            defaultValue = {this.props.total}
            style={{ width: '60%' }} 
            placeholder="จำนวนเข่ง" 
            inputMode="decimal"
            onChange={(e) => this.setTotal(parseInt(e.target.value))}
          />
        </Input.Group>
      </Modal>
    
    )
  }
}

export default SetTask;
