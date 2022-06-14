import React from 'react'
import Item from './Item'

const StoreItem = (props) => {
  return (
    <div className='store-item'>
      <Item item={props.item} value={props.value} />
      <button 
        className='buy-item-button'
        onClick={() => props.buyItem({
          item: props.item,
          amount: 1,
          value: props.value,
        })}>
          Buy
      </button>
      <button
        className='buy-ten-button'
        onClick={() => props.buyItem({
          item: props.item,
          amount: 10,
          value: props.value,
        })}>
          Buy 10
        </button>
    </div>
  )
}

export default StoreItem