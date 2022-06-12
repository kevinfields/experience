import React from 'react';
import '../styling/ChemistryLab.css';

const ChemistryLab = (props) => {
  return (
    <div className='chemistry-lab' onClick={() => props.makeMedicine()}>Chemistry Lab {"("}medicine level 1{")"}</div>
  )
}

export default ChemistryLab