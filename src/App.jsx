import './App.css'
import VocabularyItem from './components/vocabulary-item/vocabulary-item'

function App() {

  return (
    <>
      <h3>Include Vocab item component here</h3>
      <VocabularyItem vocabItem={{fr_name: 'pomme', en_name: 'apple', pronunciation: 'po mm', sentence: 'Il y a une pomme sur la table.'}}>
      </VocabularyItem>
    </>
  )
}
