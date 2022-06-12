import React from 'react';
import '../styling/LemonGrove.css';

const LemonGrove = (props) => {
  return (
    <div className='lemon-grove' onClick={() => props.plantLemons()}>Lemon Grove {"("}farming level 11{")"}</div>
  )
}

export default LemonGrove