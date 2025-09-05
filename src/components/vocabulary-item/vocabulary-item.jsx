import DOMPurify from "dompurify";
import { Utilitise } from "../utilities";
import { useRef, useEffect, useState } from "react";

function VocabularyItem({vocab, config}) {
  const [showAllExamples, setShowAllExamples] = useState(false);
  const examplesWrapperRef = useRef(null);
  // Modal state for conjugation
  const [showConjugationModal, setShowConjugationModal] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (examplesWrapperRef.current && !examplesWrapperRef.current.contains(event.target)) {
        setShowAllExamples(false);
      }
    }
    if (showAllExamples) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAllExamples]);

  function getFrenchNameWithArticle(vocab) {
    if (vocab.article && vocab.gender) {
      // Handle l' (elision)
      if (vocab.article === "l'") {
        return `l'${vocab.name_fr}`;
      }
      return `${vocab.article} ${vocab.name_fr}`;
    }
    return vocab.name_fr;
  }

  async function pause(seconds = 2000) {
    const prom = new Promise((resolve) => {
      setTimeout(() => resolve(), seconds)
    });

    return prom;
  }
  async function playit(){
    Utilitise.playIt(vocab.name_fr, 'fr-CA', async () => {
      await pause(1000);
      Utilitise.playIt(vocab.name_en, 'en-US');
    });
  }

  return(
    <div className="vocab-item p-4 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="sound-icon-wrapper cursor-pointer pos-abs" onClick={playit}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
        </svg>
      </div>
      <div className="flex flex-col items-center justify-between mb-4">
        <h2
          className={`mb-3 text-2xl font-bold leading-none text-gray-900 dark:text-white ${vocab.gender === 'masculine' ? 'bg-blue-100' : vocab.gender === 'feminine' ? 'bg-red-100' : ''} px-2 rounded`}
        >
          {config.enToFr ? vocab.name_en : getFrenchNameWithArticle(vocab)}
        </h2>
        <h3
          className={`text-base font-light leading-none text-gray-900 dark:text-white ${vocab.gender === 'masculine' ? 'bg-blue-100' : vocab.gender === 'feminine' ? 'bg-red-100' : ''} px-2 rounded`}
        >
          {config.enToFr ? getFrenchNameWithArticle(vocab) : vocab.name_en}
        </h3>
      </div>
      <div className="flex flex-col items-center justify-between" ref={examplesWrapperRef}>
        {vocab.example_sentences && vocab.example_sentences.length > 0 && (
          <>
            {(!showAllExamples ? [vocab.example_sentences[0]] : vocab.example_sentences).map((sentence, index) => {
              const fr_sentence_with_highlight = sentence.example_fr && sentence.highlight ? sentence.example_fr.replace(sentence.highlight, `<span class="vocab-highlight text-orange-600">${sentence.highlight}</span>`) : sentence.example_fr;
              const fr_sentence_clean = fr_sentence_with_highlight.replace(/\\"/g, '"');
              return (
                <div key={index} className="mb-1">
                  <div 
                    className="fr_example_sentence mb-0.5 text-xl cursor-pointer"
                    dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(fr_sentence_clean)}}
                    onClick={() => {
                      if (!showAllExamples) setShowAllExamples(true);
                      Utilitise.playIt(sentence.example_fr, 'fr-CA');
                    }}
                  ></div> 
                  <div className="en_example_sentence font-light">{sentence.example_en}</div>
                </div>     
              );
            })}
          </>
        )}

        { vocab.conjugation && (
          <div className="mt-2">
            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={e => {e.preventDefault(); setShowConjugationModal(true);}}>Show conjugation</a>
          </div>
        )}
        {/* Modal for conjugation */}
        {showConjugationModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50"
            onClick={() => setShowConjugationModal(false)}
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-lg w-full relative"
              style={{ paddingRight: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl font-bold z-20" onClick={() => setShowConjugationModal(false)}>&times;</button>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white sticky top-0 bg-white dark:bg-gray-900 z-10 pb-3">Conjugation of {vocab.name_fr}</h3>
              <div className="conjugation-table text-gray-900 dark:text-white"
              style={{ maxWidth: '40vw', maxHeight: '80vh', overflowY: 'auto' }}>
                {typeof vocab.conjugation === 'string' ? (
                  <div>{vocab.conjugation}</div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {Object.entries(vocab.conjugation).map(([tense, forms], idx) => (
                        <tr key={tense+idx} className="border-b border-gray-300 dark:border-gray-700">
                          <td className="font-semibold pr-2 align-top">{tense}</td>
                          <td>
                            {Array.isArray(forms) ? (
                              <ul className="list-disc ml-4">
                                {forms.map((form, i) => <li key={i}>{form}</li>)}
                              </ul>
                            ) : (
                              <span>{forms}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VocabularyItem;