import React from 'react';
import '../styling/ChemistryUpgradeLab.css';

const ChemistryUpgradeLab = (props) => {
  return (
    <div className='upgrade-lab' onClick={() => props.upgradeMedicine()}>Chemistry Upgrade Lab <div className='level-header'>{"(medicine level 11)"}</div></div>
  )
}

export default ChemistryUpgradeLab