import React, {useState, useEffect} from 'react'
import CurrentStatScreen from '../components/CurrentStatScreen';
import GameFeed from '../components/GameFeed';
import xpToLevel from '../functions/xpToLevel';
import Quadrant1 from '../quadrants/Quadrant1';
import Quadrant2 from '../quadrants/Quadrant2';
import Quadrant3 from '../quadrants/Quadrant3';
import Quadrant4 from '../quadrants/Quadrant4';
import '../styling/OutsidePage.css';

const OutsidePage = (props) => {

  const [quadrant, setQuadrant] = useState(1);
  const [startCoord, setStartCoord] = useState(20);
  const [axis, setAxis] = useState('y');
  const [current, setCurrent] = useState({
    maxHealth: 10,
    currentHealth: 0,
    maxEnergy: 10,
    currentEnergy: 0,
  })
  const [exactCoords, setExactCoords] = useState({
    x: 0,
    y: 0,
  })
  const [feed, setFeed] = useState([{id: 0, text: 'Welcome to Experience World'}]);
  const [regrownTree, setRegrownTree] = useState(false);

  const quadrantSwitcher = (quad, start, axis) => {
 
    setQuadrant(quad);
    setStartCoord(start);
    setAxis(axis);
    setExactCoords({
      x: 0,
      y: 0,
    })
  }

  const feedUpdater = (text) => {

    const feedItem = {
      id: feed.length,
      text: text,
    }
    setFeed(feed.concat(feedItem));
  }

  const regrowTree = () => {
    setRegrownTree(false);
    setTimeout(() => {
      setRegrownTree(true);
    }, 100000)
  }

  const addMedicineLevel = () => {
    setCurrent({
      ...current,
      maxHealth: current.maxHealth + 1,
      currentHealth: current.currentHealth + 1.
    })
  };

  const addFitnessLevel = () => {
    setCurrent({
      ...current,
      maxEnergy: current.maxEnergy + 1,
      currentEnergy: current.maxEnergy + 1,
    })
  };

  const loadUserCurrents = async () => {

    let data;

    await props.userRef.get().then(doc => {
      data = doc.data();
    })
    setCurrent({
      maxHealth: xpToLevel(data.medicineXp) + 10,
      maxEnergy: xpToLevel(data.fitnessXp) + 10,
      currentHealth: data.currentHealth,
      currentEnergy: data.currentEnergy,
    })
  }

  useEffect(() => {
    if (props.startCoords.quad !== 0) {
      setQuadrant(props.startCoords.quad);
      setExactCoords({
        x: props.startCoords.x,
        y: props.startCoords.y,
      })
    }
    loadUserCurrents();
  }, [])

  return (
    <div className='page'>
      {
        quadrant === 1 ? 
        <Quadrant1 
          startX={exactCoords.x !== 0 ? exactCoords.x : axis === 'x' ? startCoord : 91} 
          startY={exactCoords.y !== 0 ? exactCoords.y : axis === 'y' ? startCoord : 10} 
          switchQuadrant={(quad, start, axis) => quadrantSwitcher(quad, start, axis)} 
          itemsRef={props.itemsRef}
          userRef={props.userRef}
          featuresRef={props.featuresRef}
          addToFeed={(text) => feedUpdater(text)}
        />
        : quadrant === 2 ? 
        <Quadrant2 
          startX={exactCoords.x !== 0 ? exactCoords.x : axis === 'x' ? startCoord : 15} 
          startY={exactCoords.y !== 0 ? exactCoords.y : axis === 'y' ? startCoord : 10} 
          switchQuadrant={(quad, start, axis) => quadrantSwitcher(quad, start, axis)} 
          itemsRef={props.itemsRef}
          userRef={props.userRef}
          featuresRef={props.featuresRef}
          addToFeed={(text) => feedUpdater(text)}
          onCutTree={() => regrowTree()}
          regrown={regrownTree}
          addFitnessLevel={() => addFitnessLevel()}
        />
        : quadrant === 3 ? 
        <Quadrant3
          startX={exactCoords.x !== 0 ? exactCoords.x : axis === 'x' ? startCoord : 91} 
          startY={exactCoords.y !== 0 ? exactCoords.y : axis === 'y' ? startCoord : 85} 
          switchQuadrant={(quad, start, axis) => quadrantSwitcher(quad, start, axis)} 
          itemsRef={props.itemsRef}
          userRef={props.userRef}
          featuresRef={props.featuresRef}
          addToFeed={(text) => feedUpdater(text)}
        />
        : 
        <Quadrant4 
          startX={exactCoords.x !== 0 ? exactCoords.x : axis === 'x' ? startCoord : 15} 
          startY={exactCoords.y !== 0 ? exactCoords.y : axis === 'y' ? startCoord : 85} 
          switchQuadrant={(quad, start, axis) => quadrantSwitcher(quad, start, axis)}  
          itemsRef={props.itemsRef}
          userRef={props.userRef}
          featuresRef={props.featuresRef}
          addToFeed={(text) => feedUpdater(text)}
          onEnterStore={() => props.saveStartCoords({
            quad: 4,
            x: 50,
            y: 58,
          })}
          addMedicineLevel={() => addMedicineLevel()}
        />
      }
      <GameFeed items={feed} />
      <CurrentStatScreen 
        maxHealth={current.maxHealth} 
        maxEnergy={current.maxEnergy} 
        currentHealth={current.currentHealth} 
        currentEnergy={current.currentEnergy}
      />
    </div>
  )
}

export default OutsidePage