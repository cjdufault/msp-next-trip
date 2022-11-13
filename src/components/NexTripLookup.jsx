import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import { IntegerInput } from './IntegerInput';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import GetNexTrip from '../apiData/GetNexTrip';

export const NexTripLookup = () => {

  const [stopNumber, setStopNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState('Enter stop number in the text field.');
  const [departures, setDepartures] = useState();

  const handleGetNexTrip = async () => {

    let nexTripResult = await GetNexTrip(stopNumber);
    
    if (nexTripResult.success) {
      setStatusMessage(`Trip Info for ${nexTripResult.stops[0].description}:`);
      setDepartures(nexTripResult.departures);
    }
    else {
      setStatusMessage(nexTripResult.detail);
    }
  };

  const formatDepartureTimeText = (text, timestamp) => {
    if (text.includes(':')) return `Departs at ${text}`;
    if (text.includes('Min')) return `Departs in ${text} (${unixTimestampToLocalTime(timestamp)})`;
    return `${text} (${unixTimestampToLocalTime(timestamp)})`;
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
        <IntegerInput value={stopNumber} onChange={setStopNumber} />
        <Button 
          onClick={handleGetNexTrip} 
          variant={'contained'} 
        >
          {'Get Trip Info'}
        </Button>
      </div>
      <div>
        <h4>{statusMessage}</h4>
      </div>
      { 
        departures &&
        (
          departures.length > 0 ?
          departures.map((departure) => {
            return (
              <TableContainer>
                <Table className={'departures-table'}>
                  <TableBody>
                    {departures.map((departure) => {
                      return (
                        <TableRow
                          key={departure.departure_time}
                        >
                          <TableCell align='right'>
                            {`Route ${departure.route_id} ${departure.direction_text}`}
                          </TableCell>
                          <TableCell align='right'>{departure.description}</TableCell>
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
            )
          })
          // <DeparturesTable departures={departures} />
          : <h4>{'No current departure information available.'}</h4>
        )
      }
    </div>
  );
} 