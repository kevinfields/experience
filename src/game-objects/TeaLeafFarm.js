import React from 'react';
import '../styling/TeaLeafFarm.css';

const TeaLeafFarm = (props) => {
  return (
    <div className='tea-leaf-farm' onClick={() => props.harvestTeaLeaves()}>Tea Leaf Farm <div className='level-header'>{"(farming level 15)"}</div></div>
  )
}

export default TeaLeafFarm