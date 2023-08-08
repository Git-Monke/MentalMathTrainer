import React, { useEffect } from "react";
import useEquation from "./useEquation";
import useKeypress from "react-use-keypress";

function App() {
  const { equation, getNextEquation } = useEquation();

  const [input, setInput] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [incorrect, setIncorrect] = React.useState(0);

  const [data, setData] = React.useState([]);
  const [dt, setDt] = React.useState(0);

  const digits = Array(10)
    .fill(0)
    .map((_, i) => "" + i);

  const increment = (i) => i + 1;

  function inRange(v, min, max) {
    return v >= min && v <= max;
  }

  function calcOutlierThresh() {
    let sortedData = [...data].sort((a, b) => a - b);
    let med = ~~(data.length / 2);
    let qrange = ~~(data.length / 4);
    let Q1 = med - qrange;
    let Q3 = med + qrange;
    let IQR = (Q3 - Q1) * 1.5;
    return [sortedData[Q1] - IQR, sortedData[Q3] + IQR];
  }

  // Generates the xml for displaying recent speed data
  // To be improved later
  function genSpeedXML() {
    if (data.length < 10) {
      return <li>Not enough data</li>;
    }

    let [minThresh, maxThresh] = calcOutlierThresh();

    return data.map((_, i) => {
      let v = data[data.length - i - 1];
      return (
        <li
          className={inRange(v, minThresh, maxThresh) ? "" : "outlier"}
          key={i}
        >
          {v}
        </li>
      );
    });
  }

  function calcAverageSpeed() {
    let [minThresh, maxThresh] = calcOutlierThresh();
    let filteredData = data.filter((v) => inRange(v, minThresh, maxThresh));

    return ~~(
      filteredData.reduce(
        (p, c) => p + c * (inRange(c, minThresh, maxThresh) ? 1 : 0),
        0
      ) / filteredData.length
    );
  }

  function correctSubmition() {
    setData((d) => d.concat([~~(performance.now() - dt)]));
    setCorrect(increment);
    getNextEquation();
    setDt(performance.now());
    setInput(0);
  }

  useKeypress("Backspace", () => {
    setInput((i) => Math.floor(i / 10));
  });

  useKeypress(digits, (e) => {
    let newInput = input * 10 + parseInt(e.key);

    setInput(newInput);

    if (newInput === equation.former + equation.latter) {
      correctSubmition();
    }
  });

  useEffect(() => {
    getNextEquation();
  }, []);

  return (
    <>
      <div className="equation">
        <h1>
          {equation ? equation.former : 0} + {equation ? equation.latter : 0}
        </h1>
        <h1>=</h1>
        <h1>{input}</h1>
      </div>
      <div className="score">
        <h1>Correct: {correct}</h1>
        <h1>Incorrect: {incorrect}</h1>
        <h1>
          Average Speed:{" "}
          {data.length > 10 ? calcAverageSpeed() + "ms" : "not enough data"}
        </h1>
        <ol reversed>{genSpeedXML()}</ol>
      </div>
    </>
  );
}

export default App;
