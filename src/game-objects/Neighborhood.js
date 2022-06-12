import React from 'react';
import '../styling/Neighborhood.css';

const Neighborhood = (props) => {
  return (
    <div className='neighborhood' onClick={() => props.onRepair()}>Neighborhood {"(construction level 1)"}</div>
  )
}

export default Neighborhood