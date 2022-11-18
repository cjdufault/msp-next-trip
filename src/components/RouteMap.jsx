import Button from '@material-ui/core/Button';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import { GetRouteMapData, GetCoordinatesForPlace } from "../apiData/RouteMapData";

export const RouteMap = ({ routeNumber, mapExitCallback }) => {

  const [stopCoordinates, setStopCoordinates] = useState();

  const getCoordinates = async () => {
    let directions = await GetRouteMapData(routeNumber);
    console.log(directions);

    let coordinates = [];
    directions.forEach((direction) => {
      direction.stops.forEach((stop) => {
        coordinates.push(GetCoordinatesForPlace(stop.place_id, routeNumber, direction.direction_id));
      });
    });

    setStopCoordinates(coordinates);
  };

  getCoordinates();

  return (
    <div>
      <Button onClick={mapExitCallback}><strong>X</strong></Button>
      <MapContainer className={'route-map-container'} center={[44.987, -93.258]} zoom={13} >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {stopCoordinates && <Polyline pathOptions={{ color: 'blue' }} positions={stopCoordinates} />}
      </MapContainer>
    </div>
  )
};