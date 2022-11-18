import constants from '../constants.json';

export async function GetVehiclePositions(routeNumber) {
  let response = await fetch(`${constants.API_URL}/vehicles/${routeNumber}`);
  let vehicles = await response.json();

  return vehicles.map((v) => { return [v.latitude, v.longitude]; });
} 
