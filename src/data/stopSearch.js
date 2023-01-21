import Fuse from "fuse.js";

export async function stopSearch(query) {
  query = formatQuery(query);

  const stops = await getStopData();

  const fuse = new Fuse(stops, {
    keys: ['Name'],
    threshold: 0.3,
    ignoreFieldNorm: true
  });

  return fuse.search(query);
}

async function getStopData() {
  const response = await fetch('/stops/stops.json');
  return await response.json();
}

function formatQuery(query) {
  query = query.toLowerCase();
  query = query.replace(' and ', ' & ');
  query = query.replace('street', 'st');
  query = query.replace('avenue', 'ave');
  query = query.replace('road', 'rd');
  query = query.replace('parkway', 'pkwy');

  return query;
}
