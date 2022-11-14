import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import GetNextTrip from '../apiData/GetNextTrip';
import { IntegerInput } from './IntegerInput';

export const NextTripLookup = () => {

  const defaultStatusMessage = 'Enter stop number in the text field.';

  const [stopNumber, setStopNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState(defaultStatusMessage);
  const [departures, setDepartures] = useState();
  const [savedStops, setSavedStops] = useState(JSON.parse(localStorage.getItem('savedStops')) ?? []);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showUnSaveButton, setShowUnSaveButton] = useState(false);

  // handle inputed stop numbers
  const handleGetNextTrip = async (event) => {
    event.preventDefault();
    await fetchNextTrips(stopNumber);
  };

  const handleChangeStopInputBox = (newValue) => {
    setDepartures(null);
    setStatusMessage(defaultStatusMessage);
    setStopNumber(newValue);
  }

  // add current stop to state, localStorage
  const handleSaveStop = () => {
    let newSavedStops = savedStops;

    if (!newSavedStops.includes(stopNumber)) {
      newSavedStops.push(stopNumber);
      localStorage.setItem('savedStops', JSON.stringify(newSavedStops));
      setSavedStops((newSavedStops));
    }
  };

  // remove saved stop from state, localStorage
  const handleUnSaveStop = () => {
    let newSavedStops = [];

    for (let i = 0; i < savedStops.length; i++) {
      if (savedStops[i] !== stopNumber)
        newSavedStops.push(savedStops[i]);
    }

    setSavedStops(newSavedStops);
    localStorage.setItem('savedStops', JSON.stringify(newSavedStops));
  }

  // user has selected a previously saved stop
  const handleSelectSavedStop = async (event) => {
    let savedStop = event.target.innerText;
    setStopNumber(savedStop);
    fetchNextTrips(savedStop);
  };

  // queries API for next trips for a given stop
  const fetchNextTrips = async (stop) => {
    setDepartures(null);
    let NextTripResult = await GetNextTrip(stop);
    
    if (NextTripResult.success) {
      setStatusMessage(`Trip Info for ${NextTripResult.stops[0].description}:`);
      setDepartures(NextTripResult.departures);
    }
    else {
      setStatusMessage(NextTripResult.detail);
    }
  };

  // return a string describing the departure time, formatted appropriately 
  const formatDepartureTimeText = (text, timestamp) => {
    let departureTime = unixTimestampToLocalTime(timestamp);
    if (text.includes(':')) return `Departs at ${departureTime}`;
    if (text.includes('Min')) return `Departs in ${text} (${departureTime})`;
    return `${text} (${departureTime})`;
  };

  // convert from unix time provided by API to local time in 24h format
  const unixTimestampToLocalTime = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  // show & hide the save/un-save buttons based on current state 
  useEffect(() => {
    if (departures && savedStops.includes(stopNumber)){
      setShowSaveButton(false);
      setShowUnSaveButton(true);
    }
    else if (departures && !savedStops.includes(stopNumber)) {
      setShowSaveButton(true);
      setShowUnSaveButton(false);
    }
    else {
      setShowSaveButton(false);
      setShowUnSaveButton(false);
    }
  }, [departures, savedStops, stopNumber]);

  return (
    <div>
      <div>
        <form onSubmit={handleGetNextTrip}>
          <IntegerInput 
            value={stopNumber} 
            onChange={handleChangeStopInputBox} 
          />
          <Button 
            onClick={handleGetNextTrip} 
            size={'small'}
            variant={'outlined'} 
          >
            {'Get Trip Info'}
          </Button>
        </form>
      </div>
      <div>
        {
          showSaveButton &&
          <Button
            onClick={handleSaveStop}
            size={'small'}
            variant={'outlined'} 
          >
            {'Save This Stop'}
          </Button>
        }
        {
          showUnSaveButton &&
          <Button
            onClick={handleUnSaveStop}
            size={'small'}
            variant={'outlined'} 
          >
            {'Un-Save This Stop'}
          </Button>
        }
      </div>
      <div className={'saved-stops'}>
        {savedStops.map((stop) => {
          return (
            <Button
              key={stop}
              onClick={handleSelectSavedStop}
              className={'saved-stop-btn'}
              size={'medium'}
              variant={'outlined'}
            >
              {stop}
            </Button>
          )
        })}
      </div>
      <h4>{statusMessage}</h4>
      { 
        departures &&
        (
          departures.length > 0 ?
          <TableContainer>
            <Table className={'departures-table'}>
              <TableBody>
                {departures.map((departure) => {
                  return (
                    <TableRow key={departure.departure_time}>
                      <TableCell align='left'>
                        {`Route ${departure.route_id} ${departure.direction_text}`}
                      </TableCell>
                      <TableCell align='center'>{departure.description}</TableCell>
                      <TableCell align='right'>
                        {
                          formatDepartureTimeText(
                            departure.departure_text, 
                            departure.departure_time
                          )
                        }
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          : <h4>{'No current departure information available.'}</h4>
        )
      }
    </div>
  );
} 