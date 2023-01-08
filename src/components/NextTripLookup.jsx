import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import getNextTrip from '../data/tripData';

export const NextTripLookup = ({ mapDisplayCallback, currentStop }) => {

  const defaultStatusMessage = 'Enter stop number in the text field, or select a saved stop.';

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [stopNumber, setStopNumber] = useState(currentStop ?? '');
  const [statusMessage, setStatusMessage] = useState(defaultStatusMessage);
  const [departures, setDepartures] = useState();
  const [savedStops, setSavedStops] = useState(JSON.parse(localStorage.getItem('savedStops')) ?? []);
  const [stopDescription, setStopDescription] = useState();
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
    setStopNumber(newValue.trim()); // Safari likes to add newlines to this value
    setShowSaveButton(false);
    setShowUnSaveButton(false);
  };

  const handleSaveStop = () => {

    let savedStopNumbers = savedStops.map(stop => stop.number);

    if (!savedStopNumbers.includes(stopNumber)) {

      let stopData = {
        number: stopNumber,
        description: stopDescription
      }

      let newSavedStops = savedStops.concat(stopData);
      setSavedStops(newSavedStops);
      localStorage.setItem('savedStops', JSON.stringify(newSavedStops));
    }
  };

  const handleUnSaveStop = () => {
    let newSavedStops = savedStops.filter(stop => stop.number !== stopNumber);
    setSavedStops(newSavedStops);
    localStorage.setItem('savedStops', JSON.stringify(newSavedStops));
  };

  const handleSelectSavedStop = async (event) => {
    const savedStop = event.target.value;
    setStopNumber(savedStop.trim());
    setInternalValue(savedStop.trim());
    await fetchNextTrips(savedStop);
  };

  const fetchNextTrips = async (stop) => {
    setDepartures(null);
    const nextTripResult = await getNextTrip(stop);
    
    if (nextTripResult.success) {
      setStopDescription(nextTripResult.stops[0].description);
      setStatusMessage(nextTripResult.stops[0].description);
      setDepartures(nextTripResult.departures);
    }
    else {
      setStatusMessage(nextTripResult.detail ?? nextTripResult.errors.stop_id[0]);
    }
  };

  const formatDepartureTimeText = (text, timestamp) => {
    const departureTime = unixTimestampToLocalTime(timestamp);
    if (text.includes(':')) return `Departs at ${departureTime}`;
    if (text.includes('Min')) return `Departs in ${text} (${departureTime})`;
    return `${text} (${departureTime})`;
  };

  const unixTimestampToLocalTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  const updateStopUnstopButtons = (
    currentStopNumber,
    currentDepartures, 
    currentSavedStops
  ) => {
    if (currentDepartures) {
      let savedStopNumbers = currentSavedStops.map(stop => stop.number);

      let stopIsSaved = savedStopNumbers.includes(currentStopNumber);
      setShowSaveButton(!stopIsSaved);
      setShowUnSaveButton(stopIsSaved);
    }
  }

  useEffect(() => {
    updateStopUnstopButtons(stopNumber, departures, savedStops);
  }, [stopNumber, departures, savedStops]);

  // re-requests trip data every 30 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchNextTrips(stopNumber);
    }, 30000);
    return () => clearTimeout(timeout);
  });

  if (isFirstLoad) {
    setIsFirstLoad(false);
    if (stopNumber !== '') {
      fetchNextTrips(stopNumber);
    }
  }

  return (
    <div>
      <div>
        <form onSubmit={handleGetNextTrip} className={'stop-input-form'}>
          <TextField
            value={ internalValue }
            variant={'standard'}
            className={'stop-input-form__text-input'}
            onChange={ (event) => {
              const newValue = event.target.value;
              setInternalValue(newValue);
              handleChangeStopInputBox(newValue);
            }}
            onBlur={ () => {
              setInternalValue(stopNumber);
            }}
          />
          <div className={'stop-input-form__buttons'}>
            <Button 
              onClick={handleGetNextTrip} 
              size={'small'}
              variant={'contained'} 
            >
              {'Get Trip Info'}
            </Button>
            {
              showSaveButton &&
              <IconButton
                onClick={handleSaveStop}
                size={'small'}
                variant={'outlined'} 
              ><SaveIcon /></IconButton>
            }
            {
              showUnSaveButton &&
              <IconButton
                onClick={handleUnSaveStop}
                size={'small'}
                variant={'outlined'} 
              ><DeleteIcon /></IconButton>
            }
          </div>
        </form>
      </div>
      <div className={'saved-stops'}>
        <span><b>{'Saved stops:'}</b></span>
        <Select
          id={'saved-stop-selector'}
          size={'small'}
          value={stopNumber}
          onChange={handleSelectSavedStop}
        >
          {savedStops.map(stop => 
            <MenuItem value={stop.number} key={stop.number}>{stop.description}</MenuItem>
          )}
        </Select>
      </div>
      <h4 className={'trip-lookup-status-message'}>{statusMessage}</h4>
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
                        <hr />
                        {departure.description}
                      </TableCell>
                      <TableCell align='right'>
                        {
                          formatDepartureTimeText(
                            departure.departure_text, 
                            departure.departure_time
                          )
                        }
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant={'contained'}
                          size={'small'}
                          onClick={() => mapDisplayCallback(departure.route_id, stopNumber)}
                        >{'Map'}</Button>
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