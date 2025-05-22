import { useState } from "react";
function getRandomNumber() {
  return Math.floor((Math.random() * 100) + 1);
}

function RandomNumberGame() {
  // random number between 1 to 100
  let [randomNumber, setRandomNumber] = useState(getRandomNumber);
  let inputNumber;
  let [checkStatus, setCheckStatus] = useState(false);
  let [isCorrect, setIsCorrect] = useState(false);
  console.log(randomNumber);

  function checkInput() {
    setIsCorrect(+inputNumber === randomNumber);
    console.log(inputNumber);
    setCheckStatus(true);
  }

  function handleInput(event) {
    inputNumber = event.target.value;
    setCheckStatus(false);
  }

  function handleNext() {
    setRandomNumber(getRandomNumber());
    inputNumber = null;
  }

  return (
    <>
      <p>Enter the number you heard:</p>
      <input type="number" onChange={(event) => handleInput(event)} max={100} min={1} />
      <div className="flex gap-10">
        <button className="bg-blue-500 px-8 py-4 rounded-sm" 
          type="button" 
          onClick={checkInput} >
          Check
        </button>
        <button className="bg-yellow-500 px-8 py-4 rounded-sm" 
        type="button"
        onClick={handleNext}>
          Next
        </button>
      </div>

      { checkStatus && isCorrect &&
        <h3>Bravo, its correct. Click Next button above to try another one.</h3>
      }

      { checkStatus && !isCorrect &&
        <h3>Wrong one, try another one.</h3>
      }
    </>
  );
}

export default RandomNumberGame;