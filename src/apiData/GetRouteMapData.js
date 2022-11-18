import constants from '../constants.json';

// let stopsResponse = await fetch(`${constants.API_URL}/stops/${routeNumber}/${direction.direction_id}`);
// let stopInfoResponse = await fetch(`${constants.API_URL}/${routeNumber}/${direction.direction_id}/${stop.place_code}`);

async function GetRouteMapData(routeNumber) {

  let directionsResponse = await fetch(`${constants.API_URL}/directions/${routeNumber}`);
  let directions = await directionsResponse.json();

  await directions.forEach(async (direction) => {
    direction.stops = await fetch(`${constants.API_URL}/stops/${routeNumber}/${direction.direction_id}`)
      .then(async (response) => await response.json());
  });

  return directions;
}

export default GetRouteMapData;