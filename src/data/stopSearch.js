import Fuse from "fuse.js";

export async function stopSearch(query) {
  const stops = await getStopData();

  const fuse = new Fuse(stops, {
    keys: ['Name']
  });

  return fuse.search(query);
}

async function getStopData() {
  const response = await fetch('/stops/stops.json');
  return await response.json();
}