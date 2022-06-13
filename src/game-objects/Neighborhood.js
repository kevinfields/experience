import React from 'react';
import '../styling/Neighborhood.css';

const Neighborhood = (props) => {
  return (
    <div className='neighborhood' onClick={() => props.onRepair()}>Neighborhood <div className='level-header'>{"(construction level 1)"}</div></div>
  )
}

export default Neighborhood