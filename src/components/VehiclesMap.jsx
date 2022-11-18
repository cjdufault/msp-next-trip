import Button from '@material-ui/core/Button';
import { useEffect } from 'react';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { GetVehiclePositions } from "../apiData/MapData";
import constants from '../constants.json';

export const VehiclesMap = ({ routeNumber, mapExitCallback }) => {

  const [vehicleCoordinates, setVehicleCoordinates] = useState();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchVehiclePositions = async () => {
    let positions = await GetVehiclePositions(routeNumber);
    setVehicleCoordinates(positions);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchVehiclePositions();
    }, 30000);
    return () => clearTimeout(timeout);
  });

  if (isFirstLoad) {
    setIsFirstLoad(false);
    fetchVehiclePositions();
  }

  return (
    <div>
      <div className={'map-header'}>
        <Button onClick={mapExitCallback}><strong>X</strong></Button>
        <small>Vehicle locations update every 30 seconds.</small>
      </div>
      <MapContainer className={'route-map-container'} center={constants.DEFAULT_COORDINATES} zoom={11} >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {
          vehicleCoordinates &&
          vehicleCoordinates.map((position) => {
            return (position[0] !== 0 && position[1] !== 0) ?
              <Marker position={position} key={`${position[0]}-${position[1]}`}></Marker>
            : ''
          })
        }
      </MapContainer>
    </div>
  )
};