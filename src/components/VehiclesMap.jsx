import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { GetVehiclePositions } from "../apiData/MapData";
import constants from '../constants.json';

export const VehiclesMap = ({ routeNumber, mapExitCallback }) => {

  const [hasFocused, setHasFocused] = useState(false);
  const [vehicleCoordinates, setVehicleCoordinates] = useState();

  const fetchVehiclePositions = async () => {
    const positions = await GetVehiclePositions(routeNumber);
    setVehicleCoordinates(positions);
  };

  function FocusMap() {
    const map = useMap();
    if (!hasFocused) {
      map.fitBounds(vehicleCoordinates, {padding: [50, 50]});
      setHasFocused(true);
    }
    return null;
  }

  // re-requests vehicle positions every 30 seconds while map is displayed
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchVehiclePositions();
    }, 30000);
    return () => clearTimeout(timeout);
  });

  return (
    <div>
      <div className={'map-header'}>
        <Button onClick={mapExitCallback}><strong>X</strong></Button>
        <small>{'Vehicle locations update every 30 seconds.'}</small>
      </div>
      <MapContainer 
        id={'route-map-container'}
        center={constants.DEFAULT_COORDINATES} 
        zoom={11}
        whenReady={fetchVehiclePositions}
      >
        {vehicleCoordinates && <FocusMap />}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {
          vehicleCoordinates &&
          vehicleCoordinates.map(position => 
            <Marker 
              position={position} 
              key={`${position[0]}-${position[1]}`} 
            /> 
          )
        }
      </MapContainer>
    </div>
  );
}