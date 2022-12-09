import React, { useState } from 'react';
import { NextTripLookup } from './components/NextTripLookup';
import { VehiclesMap } from './components/VehiclesMap';
import { RouteLookup } from './components/RouteLookup';
import { MainMenu } from './components/MainMenu';
import './App.css';

const App = () => {

  const [mode, setMode] = useState('next-trip');
  const [currentStop, setCurrentStop] = useState();
  const [mapRouteNumber, setMapRouteNumber] = useState();

  const handleMapDisplay = (routeNumber, currentStop) => {
    setMapRouteNumber(routeNumber);
    setCurrentStop(currentStop);
    setMode('route-map');
  };
  const handleMapExit = () => {
    setMapRouteNumber(null);
    setMode('next-trip');
  };
  const handleShowRouteLookup = () => {
    setMapRouteNumber(null);
    setMode('route-lookup');
  };

  return (
    <div className={'App'}>
      <header className={'App-header'}>
        <div className={'title-section'}>
          <h2>{'MSP Transit Planner'}</h2>
          <MainMenu 
            showRouteLookup={handleShowRouteLookup}
          />
        </div>
        { mode === 'route-lookup' && <RouteLookup lookupRouteCallback={handleMapDisplay} exitCallback={handleMapExit} /> }
        { mode === 'next-trip' && <NextTripLookup mapDisplayCallback={handleMapDisplay} currentStop={currentStop} /> }
        { mode === 'route-map' && <VehiclesMap routeNumber={mapRouteNumber} exitCallback={handleMapExit} /> }
      </header>
    </div>
  );
}

export default App;
