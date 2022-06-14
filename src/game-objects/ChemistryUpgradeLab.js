import React from 'react'

const ChemistryUpgradeLab = (props) => {
  return (
    <div className='chemistry-upgrade-lab' onClick={() => props.upgradeMedicine()}>Chemistry Upgrade Lab <div className='level-header'>{"(medicine level 11)"}</div></div>
  )
}

export default ChemistryUpgradeLab