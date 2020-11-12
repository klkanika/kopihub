import React, { useState,useEffect,useRef } from 'react';
import icon_steamer_1 from '../../imgs/icon_steamer_1.svg';
import icon_steamer_2 from '../../imgs/icon_steamer_2.svg';

interface ISteamerProps {
  steamerId : string
  selected : boolean
  taskId : string
  unavailable : boolean
  ownedTaskId : string
  enabled : boolean
  select : ((steamerId : string, taskId : string, selected : boolean) => void)
  taskStatus : string
}

function Steamer (props : ISteamerProps) { 
  const [selected, setSelected] = useState(false);
    var click = function handleClick  (){
    if(props.enabled){
      props.select(props.steamerId, props.taskId, props.selected)
      setSelected(!selected)
    }
  }
  console.log("render steamer")
  return (
      <div>
        {!selected && !props.unavailable && !props.taskId
         && <div className="rounded-full h-12  w-12 flex items-center justify-center"
                    style={{
                      backgroundColor: 'white',             
                      border:'1px solid #683830',   
                      filter: 'drop-shadow(0px 1px 2px rgba(104, 56, 48, 0.6))'
                    }}
                    onClick={click} >
        </div>
        }
        {selected && !props.unavailable && !props.taskId && props.taskStatus !== "TIMEUP"
         && <div className="rounded-full h-12  w-12 flex items-center justify-center" 
                    style={{
                      backgroundColor:'#EBD2B6',
                      filter: 'drop-shadow(0px 1px 2px rgba(196, 196, 196, 0.72))'
                    }} onClick={click} > 
                    <img src={icon_steamer_1} className="h-10 w-10" />  
        </div>
        }
        {props.unavailable && <div className="rounded-full h-12 w-12 flex items-center justify-center"
                    style={{backgroundColor:'#E5E5E5'}}>
        </div>
        }
        {props.taskId && props.ownedTaskId === props.taskId && props.taskStatus !== "TIMEUP"
           && <div className="rounded-full h-12 w-12  flex items-center justify-center"
                    style={{
                      backgroundColor:'#EBD2B6',
                      filter: 'drop-shadow(0px 1px 2px rgba(196, 196, 196, 0.72))'
                    }} onClick={click} > 
                    <img src={icon_steamer_1} className="h-10 w-10" />  
        
        </div>
        }      
        {props.taskId && props.ownedTaskId === props.taskId && props.taskStatus === "TIMEUP"
           && <div className="rounded-full h-12 w-12 flex items-center justify-center"
                    style={{
                      backgroundColor:'#FF5639',
                      filter: 'drop-shadow(0px 1px 2px rgba(196, 196, 196, 0.72))'
                    }}>
                    <img src={icon_steamer_2} className="h-10 w-10" />        
        
        </div>
        }      
      </div>
    )
}


export default Steamer;
