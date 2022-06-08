import React from 'react'

const FarmPatch = (props) => {
  return (
    <div className='farm-patch' onClick={() => props.farm()}>
      Farming Patch
    </div>
  )
}

export default FarmPatch