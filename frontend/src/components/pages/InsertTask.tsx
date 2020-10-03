import React, { Component } from 'react';
import { Modal, Input, Radio, message } from 'antd';

interface ITaskProps {
  closePopup: (() => void)
  addTask: ((taskName : string, total : number) => void)
  visible : boolean
}

interface ITaskState {
  taskName: string
  total: number
  taskType: string
}

const options = [
  { label: 'คิว', value: 'Q' },
  { label: 'โต๊ะ', value: 'T' }
];

class InsertTask extends Component<ITaskProps, ITaskState> {
  
  state: ITaskState = {
    taskName: "",
    total: 0,
    taskType: "T"
  };
  
  setTaskName(input : string){
    this.setState({ taskName: input })
  }

  setTotal(input : number){
    if(input > 0)
      this.setState({ total: input })
  }

  setTaskType(input : string){
    this.setState({ taskType: input })
  }

  getTaskName(){
    if(this.state.taskType === "T")
      return "โต๊ะ " + this.state.taskName
    else
      return "คิว " + this.state.taskName
  }

  verifyData(taskName : string, total: number){
    console.log(taskName)
    if(taskName === ""){
      message.error('กรุณาระบุ เลขโต๊ะหรือเลขคิว')
    }else if(total === 0){
      message.error('กรุณาระบุ จำนวนเข่ง')
    }else{
      this.props.addTask(this.getTaskName(), total)
    }
  }

  render(){
    return (
      <Modal
      visible={this.props.visible}
      title="เพิ่มออเดอร์"
      okText="บันทึก"
      cancelText="ยกเลิก"
      onCancel={this.props.closePopup}
      onOk={() => this.verifyData(this.state.taskName,this.state.total)}
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
            style={{ width: '60%' }} 
            placeholder="เลขโต๊ะหรือเลขคิว" 
            onChange={(e) => this.setTaskName(e.target.value)}
          />
        </Input.Group>
        <Input.Group compact style={{display:'flex',alignItems:'center'}}>
          <div style={{ width: '40%', textAlign:'right', paddingRight:'15px', fontSize:'1.5em'}}>จำนวนเข่ง</div>
          <Input
            size="large"
            type="number"
            style={{ width: '60%' }} 
            placeholder="จำนวนเข่ง" 
            onChange={(e) => this.setTotal(parseInt(e.target.value))}
          />
        </Input.Group>
      </Modal>
    
    )
  }
}

export default InsertTask;
