import './App.css'
import { useState } from 'react';
import RandomNumberGame from './components/random-number/random-number';
import VocabularyList from './components/vocabulary-list/vocabulary-list';

function App() {
  const [activeTab, setActiveTab] = useState('vocab');

  return (
    <>
      <nav className="flex justify-center items-center gap-4 mb-6 mt-4">
        <button
          className={`px-4 py-2 rounded font-semibold transition-colors duration-200 ${activeTab === 'vocab' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('vocab')}
        >Vocabulary</button>
        <button
          className={`px-4 py-2 rounded font-semibold transition-colors duration-200 ${activeTab === 'random' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('random')}
        >Random Number Game</button>
      </nav>
      {activeTab === 'vocab' ? <VocabularyList /> : <RandomNumberGame />}
    </>
  )
}

export default App;
