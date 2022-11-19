import Button from '@material-ui/core/Button';
import { useEffect } from 'react';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { GetVehiclePositions } from "../apiData/MapData";
import constants from '../constants.json';

export const VehiclesMap = ({ routeNumber, mapExitCallback }) => {

  const [vehicleCoordinates, setVehicleCoordinates] = useState();

  const fetchVehiclePositions = async (map) => {
    const positions = await GetVehiclePositions(routeNumber);
    setVehicleCoordinates(positions);

    // map is only passed on first load
    if (map) {
      map.panTo(getMidPoint(positions));
      map.fitBounds(positions, {padding: [50, 50]});
    } 
  };

  // gets the average of all points - used for initial focus
  const getMidPoint = (positions) => {
    let sumLat = 0;
    let sumLong = 0;

    positions.forEach((position) => {
      sumLat += position[0];
      sumLong += position[1];
    });

    return [sumLat / positions.length, sumLong / positions.length];
  };

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
        <small>Vehicle locations update every 30 seconds.</small>
      </div>
      <MapContainer 
        id={'route-map-container'} c
        enter={constants.DEFAULT_COORDINATES} 
        zoom={11} 
        whenCreated={fetchVehiclePositions}
      >
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
  )
};