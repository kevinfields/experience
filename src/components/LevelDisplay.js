import React from 'react';
import xpRemainingToNext from '../functions/xpRemainingToNext';
import xpToLevel from '../functions/xpToLevel';
import '../styling/LevelDisplay.css';

const LevelDisplay = (props) => {
  return (
    <div className='level-display'>
      <div className='level-display-item'>{props.skill} :</div>
      <div className='level-display-item'>Level {xpToLevel(props.xp)}</div>
      <div className='level-display-item'>{`(${props.xp} xp)`}</div>
      <div className='next-level-item'>Next Level in {xpRemainingToNext(props.xp)} xp</div>
    </div>
  )
}

export default LevelDisplay