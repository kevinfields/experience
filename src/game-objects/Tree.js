import React from 'react'
import '../styling/Tree.css';

const Tree = (props) => {
  return (
    <div className={props.cut ? 'tree-cut' : 'tree'} onClick={() => props.cutTree()}>{props.cut ? 'Stump' : 'Tree (fitness level 1)'}</div>
  )
}

export default Tree