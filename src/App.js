import Sentence from './components/Sentence';
import './App.css';
import React, { useCallback, useEffect, useState } from 'react'
import Settings from './components/Settings';
import { dark } from '@mui/material/styles/createPalette';

function App() {

  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    console.log(darkMode);
  }, [darkMode])

  return (
    <div style={{ backgroundColor: darkMode ? 'rgb(26, 26, 26)' : null }} className="App">
      <br />
      <br />

      <header className='intro'>
        <h1 id="titles">Type Tyme (: </h1>
        <p id="titles"> a simple typing timer</p>

        <button className="settings" onClick={() => setShowSettings(!showSettings)}>
          {showSettings ? "Timer" : "Settings"}
        </button>

      </header>


      {showSettings ? <Settings setDarkMode={setDarkMode} darkMode={darkMode} /> : <Sentence className="Sentence" darkMode={darkMode}/>}


    </div>
  );
}

export default App;
