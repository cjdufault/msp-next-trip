import Button from '@material-ui/core/Button';
import GetRouteMapData from "../apiData/GetRouteMapData";

export const RouteMap = ({ routeNumber, mapExitCallback }) => {
  return (
    <div>
      <Button onClick={mapExitCallback}>X</Button>
      
    </div>
  )
};