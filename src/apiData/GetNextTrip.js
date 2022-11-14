const API_URL = 'https://svc.metrotransit.org/nextripv2';

async function GetNextTrip(stopNumber) {

  if (stopNumber === ''){
    return { 
      'success': false, 
      'detail': 'Please enter a stop number.'
    };
  }

  let response = await fetch(`${API_URL}/${stopNumber}`);
  let json = await response.json();
  json.success = response.status === 200;
  return json;
}

export default GetNextTrip;