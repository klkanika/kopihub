import React, { useState, useEffect, useRef } from "react";

interface ITaskProps {
  taskId: string;
  time: number;
  taskName: string;
  total: number;
  userRole: string;
  status: string;
  finishDate: Date;
  setTime: (taskId: string, taskStatus: string, finishDate: Date) => void;
  timeUp: (taskId: string) => void;
  toggleTimeUp: (taskId: string) => void;
  page: string;
  setStatus: (status: string) => void;
  setFinishDate: (finishDate: Date) => void;
}

declare global {
  interface Window {
    playSound: any;
    pauseSound: any;
  }
}

function Task(props: ITaskProps) {
  const { time } = props;

  var click = function handleClick() {
    if (
      props.userRole === "CHEF" &&
      (props.status === "PENDING" || props.status === "ONGOING")
    ) {
      props.setFinishDate(props.finishDate);
      props.setStatus(props.status);
      props.setTime(props.taskId, props.status, props.finishDate);
    } else if (props.userRole === "CHEF" && props.status === "TIMEUP") {
      props.setStatus(props.status);
      props.setTime(props.taskId, props.status, props.finishDate);
    }
  };

  const statusColor = [
    { status: "PENDING", color: "green" },
    { status: "TIMEUP", color: "red" },
    { status: "ONGOING", color: "#ddd" },
  ];

  var Clock = () => {
    let minutes = Math.floor(time / (1000 * 60));
    let seconds = Math.floor(time / 1000 - minutes * 60);
    var sec = seconds < 10 ? "0" + seconds : seconds;
    var min = minutes < 10 ? "0" + minutes : minutes;
    return time <= 0 ? "00:00" : min + ":" + sec;
  };

  // console.log("render task" + props.taskId);
  return (
    <div className="relative">
      <div
        onClick={click}
        className="pt-2 overflow-hidden w-56 h-48 flex flex-wrap items-center bg-white"
        style={{ border: "1px solid #ddd", borderRadius: "5px" }}
      >
        <div className="w-1/2 pl-2 font-bold"> จำนวน {props.total} เข่ง</div>
        <div
          className="w-1/2 text-right pr-2"
          style={{ display: props.page === "EditTask" ? "none" : "" }}
        >
          {Clock()}
        </div>
        <div className="p-2 text-2xl font-bold w-full text-center">
          {props.taskName}
        </div>
        <div
          className="text-white font-bold p-2 w-full"
          style={{
            textAlign: "center",
            backgroundColor: statusColor.filter(
              (c) => c.status == props.status
            )[0].color,
          }}
        >
          {props.status}
        </div>
      </div>
    </div>
  );
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default Task;
