import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import GetNextTrip from '../apiData/GetNextTrip';

export const NextTripLookup = () => {

  const defaultStatusMessage = 'Enter stop number in the text field.';

  const [stopNumber, setStopNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState(defaultStatusMessage);
  const [departures, setDepartures] = useState();
  const [savedStops, setSavedStops] = useState(JSON.parse(localStorage.getItem('savedStops')) ?? []);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showUnSaveButton, setShowUnSaveButton] = useState(false);
  const [internalValue, setInternalValue] = useState(stopNumber);

  const handleGetNextTrip = async (event) => {
    event.preventDefault();
    await fetchNextTrips(stopNumber);
  };

  const handleChangeStopInputBox = (newValue) => {
    setDepartures(null);
    setStatusMessage(defaultStatusMessage);
    setStopNumber(newValue);
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

    for (let i = 0; i < savedStops.length; i++) {
      if (savedStops[i] !== stopNumber)
        newSavedStops.push(savedStops[i]);
    }

    setSavedStops(newSavedStops);
    localStorage.setItem('savedStops', JSON.stringify(newSavedStops));
  }

  const handleSelectSavedStop = async (event) => {
    setShowSaveButton(false);
    setShowUnSaveButton(true);
    let savedStop = event.target.innerText;
    setStopNumber(savedStop);
    setInternalValue(savedStop);
    await fetchNextTrips(savedStop);
  };

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

  const updateStopUnstopButtons = (
    currentStopNumber,
    currentDepartures, 
    currentSavedStops
  ) => {
    if (currentSavedStops.includes(currentStopNumber)) {
      setShowSaveButton(false);
      setShowUnSaveButton(true);
    }
    else if (currentDepartures && !currentSavedStops.includes(currentStopNumber)) {
      setShowSaveButton(true);
      setShowUnSaveButton(false);
    }
    else {
      setShowSaveButton(false);
      setShowUnSaveButton(false);
    }
  }

  useEffect(() => {
    updateStopUnstopButtons(stopNumber, departures, savedStops);
  }, [stopNumber, departures, savedStops]);

  return (
    <div>
      <div>
        <form 
          onSubmit={handleGetNextTrip} 
          className={'stop-input-form'}
        >
          <TextField
            value={ internalValue }
            onChange={ (event) => {
              const newValue = event.target.value;
              setInternalValue(newValue);
              handleChangeStopInputBox(newValue);
            }}
            onBlur={ () => {
              setInternalValue(stopNumber);
            }}
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
      <div className={'save-unsave-btn-area'}>
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
                    <TableRow key={`${departure.trip_id}-${departure.departure_time}`}>
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