import React from 'react'

const FarmPatch = (props) => {
  return (
    <div className='farm-patch' onClick={() => props.farm()}>
      Farming Patch <div className='level-header'>{"("}farming level 1{")"}</div>
    </div>
  )
}

export default FarmPatch