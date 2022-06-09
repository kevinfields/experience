import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Player from '../components/Player';
import Neighborhood from '../game-objects/Neighborhood';
import Store from '../game-objects/Store';
import ADD_XP from '../reducers/ADD_XP';
import REMOVE_ITEM from '../reducers/REMOVE_ITEM';
import '../styling/Quadrant4.css';

const Quadrant4 = (props) => {

  const [position, setPosition] = useState({
    x: props.startX,
    y: props.startY,
  });
  const [move, setMove] = useState('');
  const navigate = useNavigate();
  const dummy = useRef();

  useEffect(() => {
    dummy.current.focus();

    if (props.savedStart) {
      setPosition({
        x: props.savedStart.x,
        y: props.savedStart.y,
      })
    }
  }, [])

  useEffect(() => {

    if (position.x < 15) {
      props.switchQuadrant(3, position.y, 'y');
    }

    if (position.y > 85) {
      props.switchQuadrant(2, position.x, 'x');
    }

    if (position.x > 91) {
      setPosition({
        ...position,
        x: 91,
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


  const enterStore = () => {
    if (position.y > 60 || position.y < 40 || position.x > 59 || position.x < 41) {
      props.addToFeed('You are too far away from that.');
      return;
    } else {
      props.onEnterStore();
      navigate('/general-store');
    }
  }

  const repairNeighborhood = async () => {

    let hammer = false;
    let nails = false;
    let logs = false;

    await props.itemsRef.get().then(snap => {
      snap.forEach(doc =>{
        if (doc.id === 'hammer'){
          hammer = true;
        }
        if (doc.id === 'nails'){
          nails = true;
        }
        if (doc.id === 'logs'){
          logs = true;
        }
      })
    })
    if (hammer && nails && logs) {
      await REMOVE_ITEM(props.userRef, 'nails', 1);
      await REMOVE_ITEM(props.userRef, 'logs', 1);
      await ADD_XP(props.userRef, 'construction', '20');
      props.addToFeed('You use a hammer, nails, and logs to make repairs.');
      props.addToFeed('You get 20 construction xp.')
    } else {
      props.addToFeed("You need a hammer, nails, and logs to do that.");
    }
  }


  return (
    <div className='quad-4' onClick={() => dummy.current.focus()}>
      <h3 className='quad-header'>Quadrant 4: The City</h3>
      <Player x={position.x} y={position.y} />
      <Store onEnter={() => enterStore()} />
      <Neighborhood onRepair={() => repairNeighborhood()} />
      <input ref={dummy} type='text' onChange={(e) => changePosition(e.target.value)} value={move} className='control-ref'/>
    </div>
  )
}

export default Quadrant4;