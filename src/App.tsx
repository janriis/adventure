import React from 'react';
import AdventureGame from './components/AdventureGame';
import GameTutorial from './components/GameTutorial';
import './App.css';

function App() {
  return (
    <div className="App">
      <AdventureGame debugMode={true} />
      <GameTutorial />
    </div>
  );
}

export default App;
