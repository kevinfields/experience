import React, {useState, useEffect} from 'react'
import ADD_XP from '../reducers/ADD_XP'

const OutsidePage = (props) => {

  const freeFarmingXp = async () => {
    await ADD_XP(props.userRef, 'farming', 1);
  }

  return (
    <div className='page'>
      <div className='free-farming-xp' onClick={() => freeFarmingXp()}>
        Click here for free farming xp.
      </div>
    </div>
  )
}

export default OutsidePage