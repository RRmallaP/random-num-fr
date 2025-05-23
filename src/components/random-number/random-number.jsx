import { useEffect, useRef, useState } from "react";
import "./random-number.css";

let firstCall, secondCall;
const voices = speechSynthesis
      .getVoices()
      .filter(voice => voice.lang === "fr-FR");

function utterNumber(number) {
  const synth = new SpeechSynthesisUtterance(number);
  synth.lang = "fr-FR";
  synth.rate = 0.8;
  synth.voice = voices[9];

  speechSynthesis.speak(synth);
}

function getRandomNumber(prevRand) {
  const randNum = Math.floor((Math.random() * 100) + 1);
  if(!firstCall && !secondCall) {
    firstCall = randNum
  } else {
    secondCall = randNum
  }

  if(!prevRand) {
    if (firstCall && !secondCall) {
      utterNumber(randNum);
    } else {
      firstCall = null;
      secondCall = null;
    }
  } else {
    if(firstCall && secondCall) {
      utterNumber(randNum);
      firstCall = null;
      secondCall = null;
    }
  }

  return randNum;
}

function RandomNumberGame() {
  // random number between 1 to 100
  let [randomNumber, setRandomNumber] = useState(getRandomNumber);
  let inputNumber;
  let [checkStatus, setCheckStatus] = useState(false);
  let [isCorrect, setIsCorrect] = useState(false);

  const numberInputRef = useRef(null);
  const replayButton = useRef(null);
  const nextButton = useRef(null);
  console.log(randomNumber);

  function checkInput(event) {
    event.preventDefault();
    setIsCorrect(+inputNumber === randomNumber);
    setCheckStatus(true);
  }

  function handleInput(event) {
    inputNumber = event.target.value;
    setCheckStatus(false);
  }

  function handleNext() {
    setRandomNumber((prevRand) => getRandomNumber(prevRand));
    numberInputRef.current.value = '';
    numberInputRef.current.focus();
    setCheckStatus(false);
  }

  function replay() {
    utterNumber(randomNumber);
  }

  useEffect(() => {
    window.addEventListener('keyup', (event) => {
      if(event.key === 'Enter') {
        event.target === nextButton.current && handleNext;
        event.target === replayButton.current && replay;
      }
    });
  }, []);

  return (
    <div className="flex items-center justify-center bg-gray-700 min-h-dvh">
      <div className="p-6 bg-white rounded-lg border-3 min-h-80 min-w-full md:min-w-2xl">
        <div className="border-b-2 border-blue-900 mb-10">
          <h1 className="p-4 text-center text-4xl md:text-5xl text-shadow-xs text-shadow-black">
            Random Number Game
          </h1>
        </div>

          { checkStatus && isCorrect &&
            <div className="mb-5 transition duration-400 ease-in-out border rounded-xl p-4">
              <div className="flex flex-col items-center justify-center pb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="border rounded-full fill-green-600 size-14">
                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                </svg>
                
                <div className="flex items center justify-center mt-5">
                  <h3 className="text-xl pe-3">Bravo, its correct.</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-green-800 size-8 animate-bounce">
                    <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                  </svg>
                </div>

              </div>
            </div>
          }
          { checkStatus && !isCorrect &&
            <div className="mb-5 transition duration-400 ease-in-out border rounded-xl p-4">
              <div className="flex flex-col items-center justify-center pb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="border rounded-full fill-red-600 size-14">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
                <h3 className="pt-5 text-xl">Wrong one, try again!</h3>
              </div>
            </div>
          }

        <form onSubmit={(event) => checkInput(event)}>
          <div className="text-center input-wrapper pb-4 mb-5">
            <label htmlFor="number-input" className="pe-4 text-xl font-semibold">
              Enter the number you heard:
            </label>
            <input 
              ref={numberInputRef}
              id="number-input"
              className="p-3 mt-3 md:mt-0 outline outline-1 rounded-md min-w-full md:min-w-40"
              type="number" 
              onChange={(event) => handleInput(event)} 
              max={100} 
              min={1} />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-10 pb-4 mb-10">
            <button className="bg-yellow-500 px-8 py-4 rounded-sm" 
              type="button"
              ref={nextButton}
              disabled={!checkStatus}
              onClick={handleNext}>
              Next
            </button>
            <button className="bg-blue-500 px-8 py-4 rounded-sm" 
              type="submit" disabled={checkStatus}>
              Check
            </button>
            <button 
              className="bg-green-300 px-8 py-4 rounded-sm" 
              onClick={replay}
              ref={replayButton}
              type="button"
              >
                Replay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RandomNumberGame;