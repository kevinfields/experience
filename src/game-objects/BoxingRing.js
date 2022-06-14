import React from 'react';
import '../styling/BoxingRing.css';

const BoxingRing = (props) => {
  return (
    <div className='boxing-ring' onClick={() => props.box()}>Boxing Ring<div className='level-header'>{"(fitness level 14)"}</div></div>
  )
}

export default BoxingRing