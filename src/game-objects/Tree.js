import React from 'react'

const Tree = (props) => {
  return (
    <div className='tree' onClick={() => props.cutTree()}>Tree</div>
  )
}

export default Tree