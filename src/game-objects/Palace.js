import React from 'react';
import '../styling/Palace.css';

const Palace = (props) => {
  return (
    <div className='palace' onClick={() => props.upgradePalace()}>Palace<div className='level-header'>{"(construction level 15)"}</div></div>
  )
}

export default Palace