import React from 'react';
import '../styling/Bakery.css';

const Bakery = (props) => {
  return (
    <div className='bakery' onClick={() => props.bakeBread()}>Bakery <div className='level-header'>{"("}cooking level 1{")"}</div></div>
  )
}

export default Bakery