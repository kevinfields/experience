import React, { useEffect, useState, useRef } from 'react'
import Player from '../components/Player';
import Fish from '../game-objects/Fish';
import ADD_XP from '../reducers/ADD_XP';
import REMOVE_ITEM from '../reducers/REMOVE_ITEM';
import TAKE_ITEM from '../reducers/TAKE_ITEM';
import '../styling/Quadrant3.css';

const Quadrant3 = (props) => {

  const [position, setPosition] = useState({
    x: props.startX,
    y: props.startY,
  });

  const [fish, setFish] = useState({
    x: 80,
    y: 80,
    active: true,
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

  const flyFish = async () => {


    let level = false;

    await props.userRef.get().then(doc => {
      if (doc.data().huntingXp >= 1393) {
        level = true;
      }
    })

    if (!level) {
      props.addToFeed('You need a hunting level of at least 12 to catch that.');
      return;
    }

    let feathers = false;
    let pole = false;

    await props.itemsRef.get().then(snap => {
      snap.forEach(doc => {
        if (doc.id === 'feathers') {
          feathers = true;
        }
        if (doc.id === 'fishing_pole') {
          pole = true;
        }
      })
    })

    if (!feathers || !pole) {
      props.addToFeed('You need a fishing pole and feathers to catch that.');
      return;
    }

    let fishData;
    let currentTime = new Date();

    await props.featuresRef.doc('fish').get().then(doc => {
      fishData = doc.data();
    })

    if (fishData === undefined) {
      await props.featuresRef.set({
        currentlyCaught: true,
        lastCatchTime: currentTime,
      })
    } else {
      if (fishData.currentlyCaught) {
        let remainder = Math.floor(50 - (currentTime.getTime() - fishData.lastCatchTime * 1000));
        props.addToFeed(`You can fish again in ${remainder} seconds`);
      } else {
        await TAKE_ITEM(props.userRef, {
          item: 'fish',
          amount: 1,
          value: 10,
        });
        await REMOVE_ITEM(props.userRef, 'feathers', 1);
        await ADD_XP(props.userRef, 'hunting', 80);
        await props.featuresRef.doc('fish').set({
          currentlyCaught: true,
          lastCatchTime: currentTime,
        });
        props.addToFeed('You use a feather and cathc a fish, gaining 80 hunting xp.');
        setFish({
          ...fish,
          active: false,
        })
        setTimeout(() => {
          setFish({
            x: 80,
            y: 80,
            active: true,
          })
        }, 50000)
      }
    }
  }

  useEffect(() => {
    if (fish.active) {
      setTimeout(() => {
        if (fish.x > 20) {
          setFish({
            x: fish.x - 1,
            y: fish.y - 1,
            active: true,
          })
        } else {
          setFish({
            x: 80,
            y: 80,
            active: true,
          })
        }
      }, 1000)
    }
  }, [fish])

  return (
    <div className='quad-3' onClick={() => dummy.current.focus()}>
      <h3 className='quad-header'>Quadrant 3: The Ocean</h3>
      <Player x={position.x} y={position.y} />
      {fish.active ? <Fish x={fish.x} y={fish.y} onFlyFish={() => flyFish()} /> : null} 
      <input ref={dummy} type='text' onChange={(e) => changePosition(e.target.value)} value={move} className='control-ref'/>
    </div>
  )
}

export default Quadrant3