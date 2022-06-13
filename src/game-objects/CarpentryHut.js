import React from 'react';
import '../styling/CarpentryHut.css';

const CarpentryHut = (props) => {
  return (
    <div className='carpentry-hut' onClick={() => props.makeUpgrade()}>Carpentry Hut <div className='level-header'>{'(crafting level 12'}</div></div>
  )
}

export default CarpentryHut