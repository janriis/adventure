import React from 'react';
import AdventureGame from './components/AdventureGame';
import './App.css';

function App() {
  return (
    <div className="App">
      <AdventureGame debugMode={true} />
    </div>
  );
}

export default App;
