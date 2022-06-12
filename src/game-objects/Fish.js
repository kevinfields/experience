import React from 'react';
import '../styling/Fish.css';

const Fish = (props) => {
  return (
    <div className='fish' style={{
      position: 'fixed',
      left: `${props.x}vw`,
      bottom: `${props.y}vh`,
    }} onClick={() => props.onFlyFish()}>Fish {"(hunting level 12)"}</div>
  )
}

export default Fish