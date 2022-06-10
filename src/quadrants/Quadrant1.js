import React, { useEffect, useState, useRef } from 'react'
import Player from '../components/Player';
import xpToLevel from '../functions/xpToLevel';
import Bakery from '../game-objects/Bakery';
import LemonGrove from '../game-objects/LemonGrove';
import ADD_XP from '../reducers/ADD_XP';
import REMOVE_ITEM from '../reducers/REMOVE_ITEM';
import TAKE_ITEM from '../reducers/TAKE_ITEM';
import '../styling/Quadrant1.css';

const Quadrant1 = (props) => {

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
      props.switchQuadrant(2, position.y, 'y');
    }

    if (position.y < 10) {
      props.switchQuadrant(3, position.x, 'x')
    }

    if (position.x <15) {
      setPosition({
        ...position,
        x: 15,
      })
    }

    if (position.y > 85) {
      setPosition({
        ...position,
        y: 85,
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

  useEffect(() => {
    dummy.current.focus();
  }, [])


  const bakeBread = async () => {

    if (position.x < 34 || position.x > 52 || position.y > 72 || position.y < 54) {
      props.addToFeed('You are too far away from that.');
      return;
    }

    let dough = false;
    let count = 0;
    await props.itemsRef.get().then(snap => {
      snap.forEach(doc => {
        if (doc.id === 'bread_dough') {
          dough = true;
          count = doc.data().amount;
        }
      })
    })

    if (dough) {

      if (count > 1) {
        await REMOVE_ITEM(props.userRef, 'bread_dough', 1);
      } else {
        await props.itemsRef.doc('bread_dough').delete();
      }

      await TAKE_ITEM(props.userRef, {
        item: 'bread',
        value: 7,
        amount: 1,
      })
      await ADD_XP(props.userRef, 'cooking', 10);
      props.addToFeed('You bake the bread dough.');
      props.addToFeed('You get a piece of bread and 10 cooking xp.');
    } else {
      props.addToFeed('You need bread dough to do that.');
    }
  }

  const plantLemons = async () => {

    let userData;
    await props.userRef.get().then(doc => {
      userData = doc.data();
    });
    if (xpToLevel(userData.farmingXp) < 11) {
      props.addToFeed('You must have level 11 farming to do that.');
      return;
    }

    let lemonSeed = false;
    await props.itemsRef.get().then(snap => {
      snap.forEach(doc => {
        if (doc.id === 'lemon_seed') {
          lemonSeed = true;
        }
      })
    })

    if (lemonSeed) {

      let currentGroveData;

      await props.featuresRef.doc('lemon_grove').get().then(doc => {
        currentGroveData = doc.data();
      });

      if (currentGroveData === undefined) {
        currentGroveData = {
          currentlyFarming: false,
        }
      }

      if (currentGroveData.currentlyFarming) {
        let time = new Date().getTime();
        let startTime = currentGroveData.startTime.seconds * 1000;
        if (time - startTime >= 100000) {
          await TAKE_ITEM(props.userRef, {
            item: 'lemon',
            value: 5,
            amount: 5,
          })
          await ADD_XP(props.userRef, 'farming', 50);
          await props.featuresRef.doc('lemon_grove').set({
            currentlyFarming: false,
          })
          props.addToFeed('You take 5 lemons, and gain 50 farming xp.');
        } else {
          props.addToFeed(`Your lemons will be done growing in ${Math.floor(100 - ((time - startTime) / 1000))} seconds.`)
        }
      } else {
        await REMOVE_ITEM(props.userRef, 'lemon_seed', 1);
        props.addToFeed('You plant a lemon seed');
        await props.featuresRef.doc('lemon_grove').set({
          currentlyFarming: true,
          startTime: new Date(),
        })
      }
    } else {
      props.addToFeed('You need a lemon seed to do that.');
    }
  }

  return (
    <div className='quad-1' onClick={() => dummy.current.focus()}>
      <h3 className='quad-header'>Quadrant 1: The Desert</h3>
      <Player x={position.x} y={position.y} />
      <Bakery bakeBread={() => bakeBread()} />
      <LemonGrove plantLemons={() => plantLemons()} />
      <input ref={dummy} type='text' onChange={(e) => changePosition(e.target.value)} value={move} className='control-ref'/>
    </div>
  )
}

export default Quadrant1