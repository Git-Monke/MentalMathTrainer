import React from "react";

function rand() {
  return Math.floor(Math.random() * 10);
}

function useEquation() {
  const [equation, setEquation] = React.useState();
  function getNextEquation() {
    const equation = {
      former: rand(),
      latter: rand(),
    };
    setEquation(equation);
  }

  return { equation, getNextEquation };
}

export default useEquation;
