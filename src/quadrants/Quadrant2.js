import React, { useEffect, useState, useRef } from 'react'
import Player from '../components/Player';
import FarmPatch from '../game-objects/FarmPatch';
import Tree from '../game-objects/Tree';
import ADD_XP from '../reducers/ADD_XP';
import TAKE_ITEM from '../reducers/TAKE_ITEM';
import '../styling/Quadrant2.css';

const Quadrant2 = (props) => {

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

    if (position.x < 15) {
      props.switchQuadrant(1, position.y, 'y');
    }

    if (position.y < 10) {
      props.switchQuadrant(4, position.x, 'x')
    }

    if (position.x > 91) {
      setPosition({
        ...position,
        x: 91,
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

  const farmItems = async () => {

    if (position.x < 35 || position.x > 51 || position.y < 43 || position.y > 62) {
      props.addToFeed('You are too far away from that.');
      return;
    }

    let farmData;
    await props.featuresRef.doc('farm_patch').get().then(doc => {
      farmData = doc.data();
    });

    if (farmData === undefined) {
      props.featuresRef.doc('farm_patch').set({
        currentlyFarming: false,
      })
      farmData = {
        currentlyFarming: false,
      }
    }

    if (farmData.currentlyFarming) {
      let time = new Date().getTime();
      let startTime = farmData.startTime.seconds * 1000;
      if (time - startTime > 100000) {
        const newData = {
          currentlyFarming: false,
        };
        await ADD_XP(props.userRef, 'farming', 30);
        await TAKE_ITEM(props.userRef, {
          item: 'carrot',
          amount: 10,
          value: 3,
        });
        await props.featuresRef.doc('farm_patch').set(newData);
        props.addToFeed('You get 10 carrots, and 30 farming xp.');
      } else {
        props.addToFeed(`Your carrots will be ready in ${Math.floor(100 - ((time - startTime) / 1000))} seconds.`);
      }
    } else {
      let carrotSeeds = {
        any: false,
        amount: 0,
      };
      await props.itemsRef.get().then(snap => {
        snap.forEach(doc => {
          if (doc.id === 'carrot_seed'){
            carrotSeeds = {
              any: true,
              amount: doc.data().amount,
            }
          }
        })
      })
      if (carrotSeeds.any) {
        if (carrotSeeds.amount > 1) {
          await props.itemsRef.doc('carrot_seed').set({
            amount: carrotSeeds.amount - 1,
            value: (carrotSeeds.amount - 1) * 2,
          })
        } else {
          await props.itemsRef.doc('carrot_seed').delete();
        }
        await props.featuresRef.doc('farm_patch').set({
          currentlyFarming: true,
          startTime: new Date(),
        });
        props.addToFeed('You plant a carrot seed.');
      } else {
        props.addToFeed('You need a carrot seed to do that.');
      }
    }

  }


  const cutTree = async () => {
    if (position.x < 35 || position.x > 51 || position.y < 43 || position.y > 62) {
      props.addToFeed('You are too far away from that.');
      return;
    }

    let treeData;
    await props.featuresRef.doc('tree').get().then(doc => {
      treeData = doc.data();
    });

    if (treeData === undefined) {
      props.featuresRef.doc('tree').set({
        currentlyCut: false,
      })
      treeData = {
        currentlyCut: false,
      }
    };

    if (!treeData.currentlyCut) {

      let axe = false;
      await props.itemsRef.get().then(snap => {
        snap.forEach(doc => {
          if (doc.id === 'axe'){
            axe = true;
          }
        })
      })
      if (axe) {
        await TAKE_ITEM(props.userRef, {
          item: 'logs',
          amount: 1,
          value: 5,
        });
        await ADD_XP(props.userRef, 'fitness', 10);
        await props.featuresRef.doc('tree').set({
          currentlyCut: true,
          cutTime: new Date(),
        });
        props.addToFeed('You cut down the tree, gaining 1 log and 10 fitness xp.')
      } else {
        props.addToFeed('You need an axe to do that.')
      }
    } else {

      const timestamp = new Date();
      const cutTime = treeData.cutTime.seconds * 1000;
      const remainder = Math.floor(100 - ((timestamp - cutTime) / 1000));

      if (remainder > 0) {
        props.addToFeed(`The tree is currently cut, it will regrow in ${remainder} seconds.`)
      } else {
        await props.featuresRef.doc('tree').set({
          currentlyCut: false,
        }).then(() => {
          cutTree();
        })
      }
    }
  }


  return (
    <div className='quad-2' onClick={() => dummy.current.focus()}>
      <h3 className='quad-header'>Quadrant 2: The Woods</h3>
      <Player x={position.x} y={position.y} />
      <FarmPatch farm={() => farmItems()} />
      <Tree cutTree={() => cutTree()} />
      <input ref={dummy} type='text' onChange={(e) => changePosition(e.target.value)} value={move} className='control-ref'/>
    </div>
  )
}

export default Quadrant2