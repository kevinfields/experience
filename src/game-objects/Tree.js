import React from 'react'
import '../styling/Tree.css';

const Tree = (props) => {
  return (
    <div className={props.cut ? 'tree-cut' : 'tree'} onClick={() => props.cutTree()}>{props.cut ? 'Stump' : 'Tree '} <div className='level-header'>{'(fitness level 1)'}</div></div>
  )
}

export default Tree