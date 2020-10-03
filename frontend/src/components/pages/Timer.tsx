import React, { Component } from 'react';

interface ITimeProps {
  time: number
}
interface ITimeState {
}

class Timer extends Component<ITimeProps, ITimeState> {
  
  Clock(){
    let minutes = Math.floor(this.props.time / (1000 * 60));
    let seconds = Math.floor((this.props.time / 1000) - (minutes * 60));
    var sec = seconds < 10 ? '0' + seconds : seconds;
    var min = minutes < 10 ? '0' + minutes : minutes;
    return this.props.time <= 0 ? "00:00" : min + ':' + sec;
  }

  render(){
    return (
    <div>     
       {this.Clock()}
    </div>
    )
  }
}

export default Timer;
