import React from 'react';
import '../styling/Fish.css';

const Fish = (props) => {
  return (
    <div className='fish' style={{
      position: 'fixed',
      left: `${props.x}vw`,
      bottom: `${props.y}vh`,
    }} onClick={() => props.onFlyFish()}>Fish <div className='level-header'>{"(hunting level 12)"}</div></div>
  )
}

export default Fish