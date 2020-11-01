import React, { useState,useEffect,useRef } from 'react';
import Timer from './Timer';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import {
  UPDATE_TASK_CANCEL
} from '../../utils/graphql';
import {
  useMutation
} from '@apollo/react-hooks'
import { OmitProps } from 'antd/lib/transfer/ListBody';
import { responsePathAsArray } from 'graphql';
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
  
  return (
      <div>
        {!selected && !props.unavailable && !props.taskId
         && <div className="rounded-full h-10 w-10 flex items-center justify-center border-solid  border-2 border-orange-800"
                    style={{backgroundColor:'white'}} onClick={click} >
        </div>
        }
        {selected && !props.unavailable && !props.taskId && props.taskStatus !== "TIMEUP"
         && <div className="rounded-full h-10 w-10 flex items-center justify-center" 
                    style={{backgroundColor:'	#FFE4B5'}} onClick={click} > 
                    <img src={icon_steamer_1} className="h-8 w-8" />  
        </div>
        }
        {props.unavailable && <div className="rounded-full h-10 w-10 flex items-center justify-center"
                    style={{backgroundColor:'#D3D3D3'}}>
        </div>
        }
        {props.taskId && props.ownedTaskId === props.taskId && props.taskStatus !== "TIMEUP"
           && <div className="rounded-full h-10 w-10 flex items-center justify-center"
                    style={{backgroundColor:'	#FFE4B5'}}>
                    <img src={icon_steamer_1} className="h-8 w-8" />  
        
        </div>
        }      
        {props.taskId && props.ownedTaskId === props.taskId && props.taskStatus === "TIMEUP"
           && <div className="rounded-full h-10 w-10 flex items-center justify-center"
                    style={{backgroundColor:'#FF4500'}}>
                    <img src={icon_steamer_2} className="h-8 w-8" />        
        
        </div>
        }      
      </div>
    )
}


export default Steamer;
