import React, { useState } from 'react';
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

  const handleGetNextTrip = async (event) => {
    event.preventDefault();
    await fetchNextTrips(stopNumber);
  };

  const handleChangeStopInputBox = (newValue) => {
    setDepartures(null);
    setStatusMessage(defaultStatusMessage);
    setStopNumber(newValue);
    setShowSaveButton(false);
    setShowUnSaveButton(false);
  }

  const handleSaveStop = () => {
    let newSavedStops = savedStops;
    setShowSaveButton(false);
    setShowUnSaveButton(true);

    if (!newSavedStops.includes(stopNumber)) {
      newSavedStops.push(stopNumber);
      localStorage.setItem('savedStops', JSON.stringify(newSavedStops));
      setSavedStops((newSavedStops));
    }
  };

  const handleUnSaveStop = () => {
    let newSavedStops = [];
    setShowSaveButton(true);
    setShowUnSaveButton(false);

    for (let i = 0; i < savedStops.length; i++) {
      if (savedStops[i] !== stopNumber)
        newSavedStops.push(savedStops[i]);
    }

    setSavedStops(newSavedStops);
    localStorage.setItem('savedStops', JSON.stringify(newSavedStops));
  }

  const handleSelectSavedStop = async (event) => {
    let savedStop = event.target.innerText;
    setShowSaveButton(false);
    setShowUnSaveButton(true);
    setStopNumber(savedStop);
    fetchNextTrips(savedStop);
  };

  const fetchNextTrips = async (stop) => {
    setDepartures(null);
    let NextTripResult = await GetNextTrip(stop);
    
    if (NextTripResult.success) {
      setStatusMessage(`Trip Info for ${NextTripResult.stops[0].description}:`);
      setDepartures(NextTripResult.departures);

      if (savedStops.includes(stop)) {
        setShowSaveButton(false);
        setShowUnSaveButton(true);
      }
      else {
        setShowSaveButton(true);
        setShowUnSaveButton(false);
      }
    }
    else {
      setStatusMessage(NextTripResult.detail);
    }
  };

  const formatDepartureTimeText = (text, timestamp) => {
    let departureTime = unixTimestampToLocalTime(timestamp);
    if (text.includes(':')) return `Departs at ${departureTime}`;
    if (text.includes('Min')) return `Departs in ${text} (${departureTime})`;
    return `${text} (${departureTime})`;
  };

  const unixTimestampToLocalTime = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  };

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