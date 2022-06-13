import React from 'react';
import '../styling/FletchingHut.css';

const FletchingHut = (props) => {
  return (
    <div className='fletching-hut' onClick={() => props.onFletch()}>Fletching Hut <div className='level-header'>{"(crafting level 1)"}</div></div>
  )
}

export default FletchingHut