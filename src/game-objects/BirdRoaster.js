import React from 'react';
import '../styling/BirdRoaster.css';

const BirdRoaster = (props) => {
  return (
    <div className='bird-roaster' onClick={() => props.cookBird()}>Bird Roaster <div className='level-header'>{"(cooking level 10)"}</div></div>
  )
}

export default BirdRoaster