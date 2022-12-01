import constants from '../constants.json';

async function getNextTrip(stopNumber) {

  if (stopNumber === ''){
    return { 
      'success': false, 
      'detail': 'Please enter a stop number.'
    };
  }

  const response = await fetch(`${constants.API_URL}/${stopNumber}`);
  let json = await response.json();
  json.success = response.status === 200;
  return json;
}

export default getNextTrip;