import React from 'react';
import '../styling/FletchingHut.css';

const FletchingHut = (props) => {
  return (
    <div className='fletching-hut' onClick={() => props.onFletch()}>Fletching Hut {"(crafting level 1)"}</div>
  )
}

export default FletchingHut