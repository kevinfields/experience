import React from 'react';
import '../styling/Item.css';

const Item = (props) => {
  return (
    <div className='item'>
      <div className='item-title'>{props.item}</div>
      <div className='item-count'> x{props.amount}</div>
      <div className='item-value'>Value: ${props.value}</div>
    </div>

  )
}

export default Item