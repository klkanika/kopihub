import React, { Component } from 'react';
import { Modal, Input } from 'antd';

interface ITimeUpProps {
    taskId: string
  closePopup: ((taskId : string) => void);
  updateComplete: ((taskId : string) => void);
  visible : boolean
}
interface ITimeUpState {
}

class TimeUp extends Component<ITimeUpProps, ITimeUpState> {

  render(){
    return (
      <Modal
      visible={this.props.visible}
      title="ติ่มซำพร้อมเสิรฟ์"
      okText="ตกลง"
      cancelText="ยกเลิก"
      onCancel={() => this.props.closePopup("")}
      onOk={() => this.props.updateComplete(this.props.taskId)}
    
      >
        ติ่มซำพร้อมเสิรฟ์ !!!!!!
      </Modal>
    
    )
  }
}

export default TimeUp;
