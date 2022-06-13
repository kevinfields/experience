import React from 'react';
import '../styling/LemonGrove.css';

const LemonGrove = (props) => {
  return (
    <div className='lemon-grove' onClick={() => props.plantLemons()}>Lemon Grove <div className='level-header'>{"("}farming level 11{")"}</div></div>
  )
}

export default LemonGrove