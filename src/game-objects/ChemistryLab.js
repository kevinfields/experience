import React from 'react';
import '../styling/ChemistryLab.css';

const ChemistryLab = (props) => {
  return (
    <div className='chemistry-lab' onClick={() => props.makeMedicine()}>Chemistry Lab <div className='level-header'>{"("}medicine level 1{")"}</div></div>
  )
}

export default ChemistryLab