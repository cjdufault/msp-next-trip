import constants from '../constants.json';

export async function getVehiclePositions(routeNumber) {
  const response = await fetch(`${constants.API_URL}/vehicles/${routeNumber}`);

  if (response.status === 400) {
    return null;
  }
  const vehicles = await response.json();

  // inactive vehicles have coords of [0, 0] set -- filter this out
  const filteredVehicles = vehicles.filter( v => v.latitude !== 0 && v.longitude !== 0 );

  return filteredVehicles.map((fv) => { return [fv.latitude, fv.longitude]; });
} 
