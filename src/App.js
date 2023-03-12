import Sentence from './components/Sentence';
import './App.css';

function App() {

  return (
    <div className="App">
      <br/>
      <br/>

      <header className='intro'>
        <h1 id="titles">Type Tyme (: </h1>
        <p id="titles"> a simple typing timer</p>
      </header>

      <Sentence className="Sentence" />
    </div>
  );
}

export default App;
