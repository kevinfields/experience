import React from 'react';
import '../styling/FarmingPatch.css';

const FarmPatch = (props) => {
  return (
    <div className='farming-patch' onClick={() => props.farm()}>
      Farming Patch <div className='level-header'>{"("}farming level 1{")"}</div>
    </div>
  )
}

export default FarmPatch