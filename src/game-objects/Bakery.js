import React from 'react';
import '../styling/Bakery.css';

const Bakery = (props) => {
  return (
    <div className='bakery' onClick={() => props.bakeBread()}>Bakery</div>
  )
}

export default Bakery