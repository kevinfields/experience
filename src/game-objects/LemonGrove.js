import React from 'react';
import '../styling/LemonGrove.css';

const LemonGrove = (props) => {
  return (
    <div className='lemon-grove' onClick={() => props.plantLemons()}>Lemon Grove</div>
  )
}

export default LemonGrove