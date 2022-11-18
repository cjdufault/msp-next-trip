import React, { useState } from 'react';
import { NextTripLookup } from './components/NextTripLookup';
import { RouteMap } from './components/RouteMap';
import './App.css';

const App = () => {

  const [mode, setMode] = useState('next-trip');
  const [mapRouteNumber, setMapRouteNumber] = useState();

  const handleMapDisplay = (routeNumber) => {
    setMapRouteNumber(routeNumber);
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
        {mode === 'next-trip' && <NextTripLookup handleMapDisplay={handleMapDisplay} />}
        {mode === 'route-map' && <RouteMap routeNumber={mapRouteNumber} mapExitCallback={handleMapExit} />}
      </header>
    </div>
  );
}

export default App;
