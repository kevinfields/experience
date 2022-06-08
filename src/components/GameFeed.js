import React, { useEffect, useRef } from 'react';
import '../styling/GameFeed.css';

const GameFeed = (props) => {


  const latest = useRef();

  useEffect(() => {
    latest.current.scrollIntoView();
  }, [props])

  return (
    <div className='game-feed'>
      {props.items.map(item => (
        <div className='game-feed-item' key={item.id} ref={props.items.indexOf(item) === props.items.length - 1 ? latest : null}>
          {item.text}
        </div>
      ))}
    </div>
  )
}

export default GameFeed