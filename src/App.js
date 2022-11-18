import React, { useState } from 'react';
import { NextTripLookup } from './components/NextTripLookup';
import { VehiclesMap } from './components/VehiclesMap';
import './App.css';

const App = () => {

  const [mode, setMode] = useState('next-trip');
  const [currentStop, setCurrentStop] = useState();
  const [mapRouteNumber, setMapRouteNumber] = useState();

  const handleMapDisplay = (routeNumber, currentStop) => {
    setMapRouteNumber(routeNumber);
    setCurrentStop(currentStop);
    setMode('route-map');
  }

  const handleMapExit = () => {
    setMapRouteNumber(null);
    setMode('next-trip');
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>{'MSP Transit Planner'}</h1>
        {
          mode === 'next-trip' && 
          <NextTripLookup 
            handleMapDisplay={handleMapDisplay} 
            currentStop={currentStop}
          />
        }
        {mode === 'route-map' && <VehiclesMap routeNumber={mapRouteNumber} mapExitCallback={handleMapExit} />}
      </header>
    </div>
  );
}

export default App;
