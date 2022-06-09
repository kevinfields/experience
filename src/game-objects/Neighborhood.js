import React from 'react';
import '../styling/Neighborhood.css';

const Neighborhood = (props) => {
  return (
    <div className='neighborhood' onClick={() => props.onRepair()}>Neighborhood</div>
  )
}

export default Neighborhood