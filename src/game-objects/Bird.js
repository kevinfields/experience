import React from 'react';
import '../styling/Bird.css';

const Bird = (props) => {
  return (
    <div className='bird' style={{
      position: 'fixed',
      left: `${props.x}vw`,
      bottom: `${props.y}vh`,
    }} onClick={() => props.huntBird()}>Bird <div className='level-header'>{"("}hunting level 1{")"}</div></div>
  )
}

export default Bird