export async function getRouteShape(routeNumber) {
  let response = await fetch(`/shapes/${routeNumber}.json`);
  let routeData = await response.json();

  let shapes = routeData.Points.map((point) => [point.Lat, point.Lon]);
  return shapes;
}