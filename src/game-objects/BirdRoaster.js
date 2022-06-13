import React from 'react';
import '../styling/BirdRoaster.css';

const BirdRoaster = (props) => {
  return (
    <div className='bird-roaster' onClick={() => props.cookBird()}>Bird Roaster {"(cooking level 10)"}</div>
  )
}

export default BirdRoaster