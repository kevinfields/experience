import React from 'react';
import '../styling/FishFry.css';

const FishFry = (props) => {
  return (
    <div className='fish-fry' onClick={() => props.fryFish()}>Fish Fry <div className='level-header'>{"(cooking level 17)"}</div></div>
  )
}

export default FishFry