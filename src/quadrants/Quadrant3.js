import React, { useEffect, useState, useRef } from 'react'
import Player from '../components/Player';
import Fish from '../game-objects/Fish';
import House from '../game-objects/House';
import SwimmingLap from '../game-objects/SwimmingLap';
import ToolShed from '../game-objects/ToolShed';
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
      await props.featuresRef.doc('fish').set({
        currentlyCaught: true,
        lastCatchTime: currentTime,
      });
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
      props.addToFeed('You use a feather and catch a fish, gaining 80 hunting xp.');
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
    } else {
      let elapsed = Math.floor((currentTime.getTime() - (fishData.lastCatchTime.seconds * 1000)) / 1000);

      if (elapsed <= 50) {
        props.addToFeed(`You can fish again in ${50 - elapsed} seconds`);
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
        props.addToFeed('You use a feather and catch a fish, gaining 80 hunting xp.');
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

  const upgradeHouse = async () => {

    let upgrade = false;
    let level = false;

    await props.userRef.get().then(doc => {
      level = doc.data().constructionXp >= 750;
    })

    if (!level) {
      props.addToFeed('You need at least level 10 construction to do that.');
      return;
    }

    await props.itemsRef.get().then(snap => {
      snap.forEach(doc => {
        if (doc.id === 'house_upgrade') {
          upgrade = true;
        }
      })
    });

    if (!upgrade) {
      props.addToFeed('You need a house upgrade kit to do that.');
      return;
    }
    let houseData;
    await props.featuresRef.doc('house').get().then(doc => {
      houseData = doc.data();
    })

    if (houseData === undefined) {
      await props.featuresRef.doc('house').set({
        upgrades: 1,
      })
      await ADD_XP(props.userRef, 'construction', 97);
      await REMOVE_ITEM(props.userRef, 'house_upgrade', 1);
      props.addToFeed('You upgrade your house, gaining 97 construction xp.');
    } else {
      if (houseData.upgrades >= 35) {
        props.addToFeed('Your house is already fully upgraded.');
        return;
      } else {
        await props.featuresRef.doc('house').set({
          upgrades: Number(houseData.upgrades) + 1,
        })
        await ADD_XP(props.userRef, 'construction', 97);
        await REMOVE_ITEM(props.userRef, 'house_upgrade', 1);
        props.addToFeed('You upgrade your house, gaining 97 construction xp.');
      }
    }
  }

  const makeTool = async () => {

    let level = false;
    let scrap = false;

    await props.userRef.get().then(doc => {
      level = doc.data().craftingXp >= 6101;
    });

    if (!level) {
      props.addToFeed('You need a crafting level of at least 16 to do that.');
      return;
    }

    await props.itemsRef.doc('scrap_metal').get().then(doc => {
      if (doc.data() !== undefined) {
        scrap = true;
      }
    });

    if (!scrap) {
      props.addToFeed('You need some scrap metal to do that.');
      return;
    }

    await REMOVE_ITEM(props.userRef, 'scrap_metal', 1);
    await TAKE_ITEM(props.userRef, {
      item: 'building_tool',
      amount: 1,
      value: 25,
    });
    await ADD_XP(props.userRef, 'crafting', 215);
    props.addToFeed('You use some scrap metal and get a building tool and 215 crafting xp.');
  }

  const swimLap = async () => {
    
    let level = false;
    
    await props.userRef.get().then(doc => {
      level = doc.data().fitnessXp >= 750;
    })

    if (!level) {
      props.addToFeed('You need a fitness level of at least 10 to do that.');
      return;
    }

    let swimData;
    await props.featuresRef.doc('swimming_lap').get().then(doc => {
      swimData = doc.data();
    });

    const timestamp = new Date();
    if (swimData === undefined) {
      await props.featuresRef.doc('swimming_lap').set({
        lastLapDate: timestamp,
      });
      await ADD_XP(props.userRef, 'fitness', 50, () => props.addFitnessLevel());
      props.addToFeed('You swim a lap in the pool, gaining 50 fitness xp.');
    } else {
      let elapsed = timestamp.getTime() - swimData.lastLapDate.seconds * 1000;

      if (elapsed >= 50000) {
        await props.featuresRef.doc('swimming_lap').set({
          lastLapDate: timestamp,
        });
        await ADD_XP(props.userRef, 'fitness', 50, () => props.addFitnessLevel());
        props.addToFeed('You swim a lap in the pool, gaining 50 fitness xp.');
      } else {
        props.addToFeed(`The water is too dangerous, it will be calm in ${50 - Math.floor(elapsed / 1000)} seconds.`)
      }
    }

  }

  return (
    <div className='quad-3' onClick={() => dummy.current.focus()}>
      <h3 className='quad-header'>Quadrant 3: The Ocean</h3>
      <Player x={position.x} y={position.y} />
      {fish.active ? <Fish x={fish.x} y={fish.y} onFlyFish={() => flyFish()} /> : null}
      <House upgradeHouse={() => upgradeHouse()} />
      <ToolShed makeTool={() => makeTool()}/>
      <SwimmingLap swimLap={() => swimLap()} />
      <input ref={dummy} type='text' onChange={(e) => changePosition(e.target.value)} value={move} className='control-ref'/>
    </div>
  )
}

export default Quadrant3