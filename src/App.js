import { NexTripLookup } from './components/NexTripLookup';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>{'NexTrip Dashboard'}</h1>
        <NexTripLookup />
      </header>
    </div>
  );
}

export default App;
