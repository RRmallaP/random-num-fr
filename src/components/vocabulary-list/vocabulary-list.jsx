import { useEffect, useState } from "react";
import VocabularyItem from "../vocabulary-item/vocabulary-item";
import MenuBar from '../menu-bar';
import { snakeCase } from '../utilities';
import FlashCard from '../flash-card';
import { Utilitise } from "../utilities";

export default function VocabularyList() {
  const [vocabs, setVocabs] = useState(null);
  const [currentFile, setCurrentFile] = useState('/greetings_and_introductions/basic_greetings.json');
  const [config, setConfig] = useState({ enToFr: true, writingMode: false, flashcardMode: false });
  const [flashCardStates, setFlashCardStates] = useState([]);

  useEffect(() => {
    loadVocab(currentFile);
    setFlashCardStates([]); // Reset flashcard states when category changes
  }, [currentFile]);

  async function loadVocab(fileName) {
    try {
      // const vocabData = await import(`../../../public/vocab-list/${fileName}`);
      fetch(`/random-num-fr/vocab-list/${fileName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then(async response => {
        if (response.ok) {
          const vocabData = await response.json();
          setVocabs(vocabData.default || vocabData);
        }
      })
    } catch (e) {
      const defaultVocab = {
        name_en: fileName.replace('.json', '').replace(/_/g, ' '),
        name_fr: '',
        list: []
      };
      setVocabs(defaultVocab);
    }
  }

  function handleCategorySelect(pathArr) {
    const fileName = snakeCase(pathArr.join(' ')) + '.json';
    setCurrentFile(fileName);
  }

  return (
    <div className="flex items-center justify-center">
      {
        vocabs ? (
          <div className="w-full max-w-7xl p-4 bg-white sm:p-8">
            <MenuBar onCategorySelect={handleCategorySelect} config={config} setConfig={setConfig} />
            <div className="flex flex-col items-center justify-between mb-4">
              <h2 
                className="mb-4 text-3xl font-bold leading-none text-gray-900 dark:text-white cursor-pointer"
                onClick={() => {
                  if (vocabs.name_fr) {
                    Utilitise.playIt(vocabs.name_fr, 'fr-CA');
                  }
                }}
              >
                {vocabs.name_fr}
              </h2>
              <h3 className="text-2xl font-light leading-none text-gray-900 dark:text-white">{vocabs.name_en}</h3>
            </div>
            {config.flashcardMode ? (
              <div
                className="grid gap-12 p-4 mx-auto text-gray-900 dark:text-white sm:p-8"
                style={{
                  gridTemplateColumns: `repeat(${window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : window.innerWidth < 1400 ? 3 : 4}, minmax(0, 1fr))`
                }}
              >
                {vocabs.list.map((vocab, index) => (
                  <FlashCard key={index + currentFile} vocab={vocab} />
                ))}
              </div>
            ) : (
              <div className="grid gap-8 p-4 mx-auto text-gray-900 dark:text-white sm:p-8"
                style={{
                  gridTemplateColumns: `repeat(${window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : window.innerWidth < 1400 ? 3 : 4}, minmax(0, 1fr))`
                }}>
                {
                  vocabs.list.map((vocab, index) => {
                    return (<VocabularyItem key={index} vocab={vocab} config={config} />)
                  })
                }
              </div>
            )}
          </div>
        ) : (
          <p>Loading vocabs.....</p>
        )
      }
    </div>
  )
}
