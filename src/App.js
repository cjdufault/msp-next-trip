import React, { useState } from 'react';
import { NextTripLookup } from './components/NextTripLookup';
import { VehiclesMap } from './components/VehiclesMap';
import { RouteLookup } from './components/RouteLookup';
import { MainMenu } from './components/MainMenu';
import './App.css';
import { StopLookup } from './components/StopLookup';

const App = () => {

  const [mode, setMode] = useState('next-trip');
  const [currentStop, setCurrentStop] = useState();
  const [mapRouteNumber, setMapRouteNumber] = useState();

  const returnToDefault = () => {
    setMapRouteNumber(null);
    setMode('next-trip');
  };
  const handleMapDisplay = (routeNumber, currentStop) => {
    setMapRouteNumber(routeNumber);
    setCurrentStop(currentStop);
    setMode('route-map');
  };
  const handleShowRouteLookup = () => {
    setMapRouteNumber(null);
    setMode('route-lookup');
  };
  const handleShowStopLookup = () => {
    setMapRouteNumber(null);
    setMode('stop-lookup');
  }
  const handleStopLookupSelect = (stopNumber) => {
    setCurrentStop(stopNumber);
    setMode('next-trip');
  };

  return (
    <div className={'App'}>
      <header className={'App-header'}>
        <div className={'title-section'}>
          <h2 className={'main-title'} onClick={returnToDefault}>{'MSP Transit Planner'}</h2>
          <MainMenu 
            showRouteLookup={handleShowRouteLookup}
            showStopLookup={handleShowStopLookup}
          />
        </div>
        { mode === 'route-lookup' && <RouteLookup lookupRouteCallback={handleMapDisplay} exitCallback={returnToDefault} /> }
        { mode === 'next-trip' && <NextTripLookup mapDisplayCallback={handleMapDisplay} currentStop={currentStop} /> }
        { mode === 'route-map' && <VehiclesMap routeNumber={mapRouteNumber} exitCallback={returnToDefault} /> }
        { mode === 'stop-lookup' && <StopLookup lookupStopCallback={handleStopLookupSelect} exitCallback={returnToDefault} /> }
      </header>
    </div>
  );
}

export default App;
