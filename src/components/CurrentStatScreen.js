import React from 'react'

const CurrentStatScreen = (props) => {
  return (
    <div className='current-stats-screen'>
      <div className='single-stat'>Health: {props.currentHealth} / {props.maxHealth}</div>
      <div className='single-stat'>Energy: {props.currentEnergy} / {props.maxEnergy}</div>
    </div>
  )
}

export default CurrentStatScreen