import { useRef, useState } from "react";
import "./random-number.css";

const voices = speechSynthesis
      .getVoices()
      .filter(voice => voice.lang === "fr-FR");

function utterNumber(number) {
  const synth = new SpeechSynthesisUtterance(number);
  synth.lang = "fr-FR";
  synth.rate = 0.75;
  synth.voice = voices[9];

  speechSynthesis.speak(synth);
}

function getRandomNumber() {
  const randNum = Math.floor((Math.random() * 100) + 1);
  utterNumber(randNum);
  return randNum;
}

function RandomNumberGame() {
  // random number between 1 to 100
  let [randomNumber, setRandomNumber] = useState(getRandomNumber);
  let inputNumber;
  let [checkStatus, setCheckStatus] = useState(false);
  let [isCorrect, setIsCorrect] = useState(false);

  const numberInputRef = useRef(null);
  console.log(randomNumber);

  function checkInput(event) {
    event.preventDefault();
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
    numberInputRef.current.value = '';
    numberInputRef.current.focus();
    setCheckStatus(false);
  }

  return (
    <div className="flex items-center justify-center bg-gray-700 min-h-dvh">
      <div className="p-6 bg-white rounded-lg border-3 min-w-2xl">
        <form onSubmit={(event) => checkInput(event)}>
          <div className="input-wrapper pb-4 mb-5">
            <label htmlFor="number-input" className="pe-4 text-xl font-semibold">
              Enter the number you heard:
            </label>
            <input 
              ref={numberInputRef}
              id="number-input"
              className="px-3 outline outline-1 rounded-md min-w-40"
              type="number" 
              onChange={(event) => handleInput(event)} 
              max={100} 
              min={1} />
          </div>
          <div className=" flex gap-10 pb-4 mb-5">
            <button className="bg-blue-500 px-8 py-4 rounded-sm" 
              type="submit" disabled={checkStatus}>
              Check
            </button>
            <button className="bg-yellow-500 px-8 py-4 rounded-sm" 
            type="button"
            disabled={!checkStatus}
            onClick={handleNext}>
              Next
            </button>
          </div>

          { checkStatus && isCorrect &&
            <h3 className="pb-4 mb-5">
              Bravo, its correct. Click Next button above to try another one.
            </h3>
          }

          { checkStatus && !isCorrect &&
            <h3 className="pb-4 mb-5">
              Wrong one, try again or go to next one.
            </h3>
          }
        </form>
      </div>
    </div>
  );
}

export default RandomNumberGame;