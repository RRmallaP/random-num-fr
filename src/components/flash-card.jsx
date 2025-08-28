import React, { useState } from "react";
import { Utilitise } from "./utilities";

function FlashCard({ vocab }) {
  const [flipped, setFlipped] = useState(false);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState(null);

  function handleFlip() {
    // Only play audio if flipping by user click and not already flipped
    if (!flipped && vocab.name_fr) {
      Utilitise.playIt(vocab.name_fr, 'fr-CA');
    }
    setFlipped(prev => !prev);
    setChecked(false);
    setResult(null);
    setInput("");
  }

  function handleCheck() {
    setChecked(true);
    setFlipped(true); // Do not play audio here
    if (input.trim() === "") {
      setResult(null);
    } else if (input.trim().toLowerCase() === vocab.name_fr.trim().toLowerCase()) {
      setResult("Correct!");
    } else {
      setResult("Try again!");
    }
  }

  return (
    <div className="flashcard-container flex flex-col items-center justify-center">
      <div
        className={`flashcard w-70 h-48 p-6 border rounded-lg shadow-lg cursor-pointer flex flex-col items-center justify-center transition-transform duration-500 ${flipped ? (vocab.gender === 'masculine' ? 'bg-blue-200' : vocab.gender === 'feminine' ? 'bg-pink-200' : 'bg-white dark:bg-gray-800') : 'bg-white dark:bg-gray-800'}`}
        onClick={handleFlip}
        style={{ perspective: '1000px' }}
      >
        {!flipped ? (
          <>
            <div className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{vocab.name_en}</div>
            <input
              type="text"
              className="border px-2 py-1 rounded w-full mb-2"
              placeholder="Type the French word..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={checked}
              onClick={e => e.stopPropagation()}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCheck();
                }
              }}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={e => { e.stopPropagation(); handleCheck(); }}
              disabled={checked}
            >Check</button>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold mb-4 text-orange-600">{vocab.name_fr}</div>
            {checked && (
              <div className={`mt-2 text-lg font-semibold ${result === 'Correct!' ? 'text-green-600' : 'text-red-600'}`}>{result ? result : ''}</div>
            )}
            {/* Show entered text when flipped */}
            {input && (
              <div className="mt-2 text-base text-gray-700 dark:text-gray-200">Your answer: <span className="font-bold">{input}</span></div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FlashCard;
