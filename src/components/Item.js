import React from 'react';
import '../styling/Item.css';

const Item = (props) => {

  const sgValue = props.value / props.amount;

  return (
    <div className='item'>
      <div className='item-title'>{props.item}</div>
      {props.amount ? <div className='item-count'> x{props.amount}</div> : null}
      <div className='item-value'>Value: ${props.value}</div>
      {props.amount ? <div className='item-subvalue'>{`($${sgValue} each)`}</div> : null}
    </div>

  )
}

export default Item