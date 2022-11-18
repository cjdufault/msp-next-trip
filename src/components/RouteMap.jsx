import Button from '@material-ui/core/Button';
import { MapContainer, TileLayer } from 'react-leaflet'
import GetRouteMapData from "../apiData/GetRouteMapData";

export const RouteMap = ({ routeNumber, mapExitCallback }) => {
  return (
    <div>
      <Button onClick={mapExitCallback}>X</Button>
      <MapContainer className={'route-map-container'} center={[44.987, -93.258]} zoom={13} >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /></MapContainer>
    </div>
  )
};