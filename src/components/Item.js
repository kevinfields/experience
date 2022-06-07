import React from 'react';
import '../styling/Item.css';

const Item = (props) => {
  return (
    <div className='item'>
      <div className='item-title'>{props.item}</div>
      {props.amount ? <div className='item-count'> x{props.amount}</div> : null}
      <div className='item-value'>Value: ${props.value}</div>
    </div>

  )
}

export default Item