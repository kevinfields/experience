import React from 'react'

const Badge = (props) => {
  return (
    <div className={`badge-${props.badge.tier}`}>
      <div className='badge-title'>{props.badge.title}</div>
      <div className='badge-desc'>{props.badge.description}</div>
    </div>

  )
}

export default Badge