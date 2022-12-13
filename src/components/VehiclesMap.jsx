import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet'
import { getVehiclePositions } from "../data/mapData";
import { getRouteShape } from '../data/shapeData';
import constants from '../constants.json';

// TODO: implement proper error handling for bad route numbers

export const VehiclesMap = ({ routeNumber, exitCallback }) => {

  const [hasFocused, setHasFocused] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [vehicleCoordinates, setVehicleCoordinates] = useState();
  const [routeShape, setRouteShape] = useState();

  const fetchVehiclePositions = async () => {
    const positions = await getVehiclePositions(routeNumber);
    setVehicleCoordinates(positions);
  };

  const fetchRouteShape = async () => {
    const shape = await getRouteShape(routeNumber);
    setRouteShape(shape);
  };

  const initData = async () => {
    setHasAttemptedFetch(true);
    await fetchRouteShape();
    await fetchVehiclePositions();
  }

  const FocusMap = () => {
    const map = useMap();
    if (!hasFocused) {  // only center focus one time
      if (vehicleCoordinates.length > 0) {
        map.fitBounds(vehicleCoordinates, {padding: [50, 50]});
      }
      setHasFocused(true);
    }
    return null;
  };

  // re-requests vehicle positions every 30 seconds while map is displayed
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (hasAttemptedFetch && vehicleCoordinates) {
        fetchVehiclePositions();
      }
    }, 30000);
    return () => clearTimeout(timeout);
  });

  return (
    <div className={'route-map-div'}>
      <div className={'map-header'}>
        <Button onClick={exitCallback}><strong>{'X'}</strong></Button>
        <small>
          {
            (hasAttemptedFetch && !vehicleCoordinates) ?
            `No data found for route "${routeNumber}".`
            : 'Vehicle locations update every 30 seconds.'
          }
        </small>
      </div>
      {
        (hasAttemptedFetch && !vehicleCoordinates) ?
        ''
        : <MapContainer 
          id={'route-map-container'}
          center={constants.DEFAULT_COORDINATES} 
          zoom={11}
          whenReady={initData}
        >
          {vehicleCoordinates && <FocusMap />}
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {
            (vehicleCoordinates && vehicleCoordinates.length > 0) &&
            vehicleCoordinates.map(position => 
              <Marker 
                position={position}
                key={`${position[0]}-${position[1]}`} 
              /> 
            )
          }
          {
            routeShape &&
            <Polyline pathOptions={{color: 'blue'}} positions={routeShape}/>
          }
        </MapContainer>
      }
    </div>
  );
}