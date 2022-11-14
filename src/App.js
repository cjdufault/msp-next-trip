import { NextTripLookup } from './components/NextTripLookup';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>{'NextTrip Dashboard'}</h1>
        <NextTripLookup />
      </header>
    </div>
  );
}

export default App;
