import React from 'react';
import '../styling/Player.css';

const Player = (props) => {
  return (
    <div className='player' style={{
      position: 'fixed',
      left: `${props.x}vw`,
      bottom: `${props.y}vh`,
    }}>
      x: {props.x} y: {props.y}
    </div>
  )
}

export default Player