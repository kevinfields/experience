import React from 'react';
import '../styling/ToolShed.css';

const ToolShed = (props) => {
  return (
    <div className='tool-shed' onClick={() => props.makeTool()}>Tool Shed <div className='level-header'>{"(crafting level 16)"}</div></div>
  )
}

export default ToolShed