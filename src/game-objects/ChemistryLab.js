import React from 'react';
import '../styling/ChemistryLab.css';

const ChemistryLab = (props) => {
  return (
    <div className='chemistry-lab' onClick={() => props.makeMedicine()}>ChemistryLab</div>
  )
}

export default ChemistryLab