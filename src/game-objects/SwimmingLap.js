import React from 'react';
import '../styling/SwimmingLap.css';

const SwimmingLap = (props) => {
  return (
    <div className='swimming-lap' onClick={() => props.swimLap()}>Swimming Lap <div className='level-header'>{"(fitness level 10)"}</div></div>
  )
}

export default SwimmingLap