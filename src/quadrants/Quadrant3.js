import React, { useEffect, useState, useRef } from 'react'
import Player from '../components/Player';
import '../styling/Quadrant3.css';

const Quadrant3 = (props) => {

  const [position, setPosition] = useState({
    x: props.startX,
    y: props.startY,
  });
  const [move, setMove] = useState('');

  const dummy = useRef();

  useEffect(() => {
    dummy.current.focus();
  }, [])

  useEffect(() => {

    if (position.x > 91) {
      props.switchQuadrant(4, position.y, 'y');
    }

    if (position.y > 85) {
      props.switchQuadrant(1, position.x, 'x')
    }

    if (position.x < 15) {
      setPosition({
        ...position,
        x: 15,
      })
    }

    if (position.y < 10) {
      setPosition({
        ...position,
        y: 10,
      })
    }

  }, [position]);

  const changePosition = (move) => {
    switch (move.toLowerCase()) {
      case 'w':
        setPosition({
          ...position,
          y: Number(position.y) + 1,
        });
        break;
      case 'd':
        setPosition({
          ...position,
          x: Number(position.x) + 1
        });
        break;
      case 's':
        setPosition({
          ...position,
          y: position.y - 1,
        });
        break;
      case 'a':
        setPosition({
          ...position,
          x: position.x - 1,
        });
        break;
      default:
        break;
    }
    setMove('');
  }

  return (
    <div className='quad-3' onClick={() => dummy.current.focus()}>
      <h3 className='quad-header'>Quadrant 3: The Ocean</h3>
      <Player x={position.x} y={position.y} />
      <input ref={dummy} type='text' onChange={(e) => changePosition(e.target.value)} value={move} className='control-ref'/>
    </div>
  )
}

export default Quadrant3