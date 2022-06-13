import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Player from '../components/Player';
import CarpentryHut from '../game-objects/CarpentryHut';
import ChemistryLab from '../game-objects/ChemistryLab';
import Neighborhood from '../game-objects/Neighborhood';
import Store from '../game-objects/Store';
import ADD_XP from '../reducers/ADD_XP';
import REMOVE_ITEM from '../reducers/REMOVE_ITEM';
import TAKE_ITEM from '../reducers/TAKE_ITEM';
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

    if (position.y < 63 || position.y > 82 || position.x < 65 || position.x > 81) {
      props.addToFeed('You are too far away from that.');
      return;
    }

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

  const makeMedicine = async () => {

    if (position.x > 36 || position.y > 67 || position.y < 43) {
      props.addToFeed('You are too far away from that.');
      return;
    }

    let aceta = false;
    let lemon = false;
    await props.itemsRef.get().then(snap => {
      snap.forEach(doc => {
        if (doc.id === 'lemon') {
          lemon = true;
        }
        if (doc.id === 'acetaminophen') {
          aceta = true;
        }
      })
    })

    if (aceta && lemon) {
      await REMOVE_ITEM(props.userRef, 'acetaminophen', 1);
      await REMOVE_ITEM(props.userRef, 'lemon', 1);
      await TAKE_ITEM(props.userRef, {
        item: 'basic_medicine',
        amount: 1,
        value: 15,
      });
      await ADD_XP(props.userRef, 'medicine', 10, () => props.addMedicineLevel());
      props.addToFeed('You make some medicine, and get 10 xp.'); 
    } else {
      props.addToFeed('You need a lemon and acetaminophen to do that.');
    } 
  };

  const makeUpgrade = async () => {
    
    let level = false;
    let nails = false;
    let hammer = false;
    let logs = false;

    await props.userRef.get().then(doc => {
      if (doc.data().craftingXp >= 1393) {
        level = true
      }
    });

    await props.itemsRef.get().then(snap => {
      snap.forEach(doc => {
        if (doc.id === 'logs') {
          logs = true;
        }
        if (doc.id === 'hammer') {
          hammer = true;
        }
        if (doc.id === 'nails') {
          nails = true;
        }
      })
    });

    if (!level) {
      props.addToFeed('You need a crafting level of at least 12 to do that.');
      return;
    }

    if (!logs || !hammer || !nails) {
      props.addToFeed('You need logs, a hammer, and nails to do that.');
      return;
    }

    await TAKE_ITEM(props.userRef, {
      item: 'house_upgrade',
      value: 50,
      amount: 1,
    })
    await REMOVE_ITEM(props.userRef, 'logs', 1);
    await REMOVE_ITEM(props.userRef, 'nails', 1);
    await ADD_XP(props.userRef, 'crafting', 100);
    props.addToFeed('You use a nail and some logs to make a house upgrade kit, gaining 100 crafting xp.');
  }


  return (
    <div className='quad-4' onClick={() => dummy.current.focus()}>
      <h3 className='quad-header'>Quadrant 4: The City</h3>
      <Player x={position.x} y={position.y} />
      <Store onEnter={() => enterStore()} />
      <Neighborhood onRepair={() => repairNeighborhood()} />
      <ChemistryLab makeMedicine={() => makeMedicine()} />
      <CarpentryHut makeUpgrade={() => makeUpgrade()} />
      <input ref={dummy} type='text' onChange={(e) => changePosition(e.target.value)} value={move} className='control-ref'/>
    </div>
  )
}

export default Quadrant4;