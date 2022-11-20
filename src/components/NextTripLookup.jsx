import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import GetNextTrip from '../apiData/TripData';

export const NextTripLookup = ({ handleMapDisplay, currentStop }) => {

  const defaultStatusMessage = 'Enter stop number in the text field, or select a saved stop.';

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [stopNumber, setStopNumber] = useState(currentStop ?? '');
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
    setStopNumber(newValue.trim()); // Safari likes to add newlines to this value
    setShowSaveButton(false);
    setShowUnSaveButton(false);
  }

  const handleSaveStop = () => {
    if (!savedStops.includes(stopNumber)) {
      let newSavedStops = savedStops.concat(stopNumber);
      setSavedStops(newSavedStops);
      localStorage.setItem('savedStops', JSON.stringify(newSavedStops));
    }
  };

  const handleUnSaveStop = () => {
    let newSavedStops = savedStops.filter(stop => stop !== stopNumber);
    setSavedStops(newSavedStops);
    localStorage.setItem('savedStops', JSON.stringify(newSavedStops));
  }

  const handleSelectSavedStop = async (event) => {
    const savedStop = event.target.innerText;
    setStopNumber(savedStop.trim());
    setInternalValue(savedStop.trim());
    await fetchNextTrips(savedStop);
  };

  const fetchNextTrips = async (stop) => {
    setDepartures(null);
    const nextTripResult = await GetNextTrip(stop);
    
    if (nextTripResult.success) {
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
      let stopIsSaved = currentSavedStops.includes(currentStopNumber);
      setShowSaveButton(!stopIsSaved);
      setShowUnSaveButton(stopIsSaved);
    }
  }

  useEffect(() => {
    updateStopUnstopButtons(stopNumber, departures, savedStops);
  }, [stopNumber, departures, savedStops]);

  if (isFirstLoad) {
    setIsFirstLoad(false);
    if (stopNumber !== '') {
      fetchNextTrips(stopNumber);
    }
  }

  return (
    <div>
      <div>
        <form 
          onSubmit={handleGetNextTrip} 
          className={'stop-input-form'}
        >
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
        {savedStops.map(stop => 
          <Button
            key={stop}
            onClick={handleSelectSavedStop}
            className={'saved-stop-btn'}
            size={'small'}
            variant={'outlined'}
          >{stop}</Button>
        )}
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
                          onClick={() => handleMapDisplay(departure.route_id, stopNumber)}
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