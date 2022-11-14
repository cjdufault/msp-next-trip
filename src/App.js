import { NextTripLookup } from './components/NextTripLookup';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>{'MSP Transit Planner'}</h1>
        <NextTripLookup />
      </header>
    </div>
  );
}

export default App;
