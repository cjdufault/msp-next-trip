import constants from '../constants.json'

export async function getRouteShape(routeNumber) {
  let directions = await getDirectionsForRoute(routeNumber);

  let shapesPerDirection = directions.map(async (direction) => {
    let response = await fetch(`/shapes/${routeNumber}_${direction}.json`);
    let routeData = await response.json();
    return routeData.Points.map((point) => [point.Lat, point.Lon]);
  });

  // hardcoding array indexes here b/c I suck at async
  return [].concat(await shapesPerDirection[0], await shapesPerDirection[1]);
}

async function getDirectionsForRoute(routeNumber) {
  let response = await fetch(`${constants.API_URL}/directions/${routeNumber}`);
  let data = await response.json();

  let directions = data.map((direction) => {
    let directionCode;
    switch(direction.direction_name) {
      case ('Northbound'):
        directionCode = 'NB';
        break;
      case ('Southbound'):
        directionCode = 'SB';
        break;
      case ('Eastbound'):
        directionCode = 'EB';
        break;
      case ('Westbound'):
        directionCode = 'WB';
        break;
      default:
        console.error(`Recieved invalid direction name" "${direction.direction_name}"`)
        break;
    }
    return directionCode;
  })

  return directions;
}