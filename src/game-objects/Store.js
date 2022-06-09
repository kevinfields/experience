import React from 'react';
import '../styling/Store.css';

const Store = (props) => {

  return (
    <div className='store' onClick={() => props.onEnter()}>
      Store
    </div>
  )
}

export default Store