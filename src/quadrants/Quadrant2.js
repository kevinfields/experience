import React, { useEffect, useState, useRef } from 'react'
import Player from '../components/Player';
import Bird from '../game-objects/Bird';
import BirdRoaster from '../game-objects/BirdRoaster';
import FarmPatch from '../game-objects/FarmPatch';
import Tree from '../game-objects/Tree';
import ADD_XP from '../reducers/ADD_XP';
import REMOVE_ITEM from '../reducers/REMOVE_ITEM';
import TAKE_ITEM from '../reducers/TAKE_ITEM';
import '../styling/Quadrant2.css';

const Quadrant2 = (props) => {

  const [position, setPosition] = useState({
    x: props.startX,
    y: props.startY,
  });
  const [bird, setBird] = useState({
    x: 20,
    y: 80,
    active: true,
  })
  const [birdTimeoutId, setBirdTimeoutId] = useState('');
  const [move, setMove] = useState('');
  const [tree, setTree] = useState(false);

  const dummy = useRef();

  const checkTree = async () => {

    let currentTime = new Date().getTime();
    await props.featuresRef.doc('tree').get().then(doc => {
      let lastCutTime = doc.data().cutTime.seconds * 1000;
      console.log('currentTime: ' + currentTime);
      console.log('lastCutTime: ' + lastCutTime);
      console.log('difference: ' + (currentTime - lastCutTime))
      if (currentTime - lastCutTime > 100000) {
        setTree(true);
      }
    })
    
  }

  useEffect(() => {
    dummy.current.focus();
    checkTree();   
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

  useEffect(() => {
    if (props.regrown) {
      setTree(true);
    }
  }, [props.regrown])

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
        await REMOVE_ITEM(props.userRef, "carrot_seed", 1);
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
    if (position.x > 76 || position.x < 65 || position.y < 59 || position.y > 71) {
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
        await ADD_XP(props.userRef, 'fitness', 10, () => props.addFitnessLevel());
        await props.featuresRef.doc('tree').set({
          currentlyCut: true,
          cutTime: new Date(),
        });
        props.addToFeed('You cut down the tree, gaining 1 log and 10 fitness xp.');
        setTree(false);
        props.onCutTree();
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

  const huntBird = async () => {

    let arrows = false;
    let bow = false;

    await props.itemsRef.get().then(snap => {
      snap.forEach(doc => {
        if (doc.id === 'arrows') {
          arrows = true;
        }
        if (doc.id === 'hunting_bow') {
          bow = true;
        }
      })
    })

    if (!arrows || !bow) {
      props.addToFeed('You need a hunting bow and an arrow to catch that.');
      return;
    }
    

    let birdData;
    let timestamp = new Date();

    await props.featuresRef.doc('bird').get().then(doc => {
      birdData = doc.data();
    })

    if (birdData === undefined) {
      await props.featuresRef.doc('bird').set({
        currentlyHunted: true,
        lastCatchDate: timestamp,
      })
      await REMOVE_ITEM(props.userRef, 'arrows', 1);
      await TAKE_ITEM(props.userRef, {
        item: 'bird_meat',
        amount: 1,
        value: 10,
      });
      await TAKE_ITEM(props.userRef, {
        item: 'feathers',
        amount: 10,
        value: 2,
      });
      await ADD_XP(props.userRef, 'hunting', 40);
      props.addToFeed('You use one arrow, and gain feathers, bird meat, and 40 hunting xp.');
    } else {

      let currentTime = timestamp.getTime();
      let lastCatchTime = birdData.lastCatchDate.seconds * 1000;

      if (currentTime - lastCatchTime >= 50000) {
        await props.featuresRef.doc('bird').set({
          currentlyHunted: true,
          lastCatchDate: timestamp,
        });
        await REMOVE_ITEM(props.userRef, 'arrows', 1);
        await TAKE_ITEM(props.userRef, {
          item: 'bird_meat',
          amount: 1,
          value: 10,
        });
        await TAKE_ITEM(props.userRef, {
          item: 'feathers',
          amount: 10,
          value: 2,
        });
        await ADD_XP(props.userRef, 'hunting', 40);
        props.addToFeed('You use one arrow, and gain 10 feathers, bird meat, and 40 hunting xp.');
        clearTimeout(birdTimeoutId);
        setBird({
          x: 0,
          y: 0,
          active: false,
        })
      } else {
        let remainder = 50 - ((currentTime - lastCatchTime)/ 1000);
        props.addToFeed(`You can hunt again in ${Math.floor(remainder)} seconds.`)
      }
    }
  }


  useEffect(() => {

    if (bird.active) {
      if (bird.x < 80) {
        setBirdTimeoutId(setTimeout(() => {
          setBird({
            ...bird,
            x: bird.x + 1,
            y: bird.y - 1,
          })
        }, 1000))
      } else {
        setBirdTimeoutId(setTimeout(() => {
          setBird({
            ...bird,
            x: 20,
            y: 80,
          })
        }, 1000))
      }
    }
  }, [bird])

  const cookBird = async () => {
    let birdMeat = false;
    let level = false;

    await props.itemsRef.get().then(snap => {
      snap.forEach(doc => {
        if (doc.id === 'bird_meat') {
          birdMeat = true;
        }
      })
    })

    await props.userRef.get().then(doc => {
      level = doc.data().cookingXp >= 750;
    })

    if (!level) {
      props.addToFeed('You must have a cooking level of 10 to do that.');
      return;
    }

    if (!birdMeat) {
      props.addToFeed('You need some bird meat to do that.');
      return;
    }

    await TAKE_ITEM(props.userRef, {
      item: 'cooked_bird',
      amount: 1,
      value: 30,
    })
    await REMOVE_ITEM(props.userRef, 'bird_meat', 1);
    await ADD_XP(props.userRef, 'cooking', 50);
    props.addToFeed('You cook the bird meat, gaining a cooked bird and 50 cooking xp.');
  }


  return (
    <div className='quad-2' onClick={() => dummy.current.focus()}>
      <h3 className='quad-header'>Quadrant 2: The Plains</h3>
      <Player x={position.x} y={position.y} />
      {bird.active ? <Bird x={bird.x} y={bird.y} huntBird={() => huntBird()}/> : null} 
      <FarmPatch farm={() => farmItems()} />
      <Tree cutTree={() => cutTree()} cut={!tree}/>
      <BirdRoaster cookBird={() => cookBird()} />
      <input ref={dummy} type='text' onChange={(e) => changePosition(e.target.value)} value={move} className='control-ref'/>
    </div>
  )
}

export default Quadrant2