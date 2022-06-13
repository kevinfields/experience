import React from 'react';
import '../styling/House.css';

const House = (props) => {
  return (
    <div className='house' onClick={() => props.upgradeHouse()}>House <div className='level-header'>{"(constructuion level 10)"}</div></div>
  )
}

export default House