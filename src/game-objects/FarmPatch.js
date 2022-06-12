import React from 'react'

const FarmPatch = (props) => {
  return (
    <div className='farm-patch' onClick={() => props.farm()}>
      Farming Patch {"("}farming level 1{")"}
    </div>
  )
}

export default FarmPatch