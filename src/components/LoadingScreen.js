import React, { useState, useEffect } from "react";
import "../styling/LoadingScreen.css";

const states = ["Loading   ", "Loading.  ", "Loading.. ", "Loading..."];

const LoadingScreen = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCounter(counter + 1);
    }, [200]);
  }, [counter]);

  return <div className="loading-screen">{states[counter % 4]}</div>;
};

export default LoadingScreen;