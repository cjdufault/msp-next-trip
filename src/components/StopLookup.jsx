import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { stopSearch } from '../data/stopSearch';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const StopLookup = ({ lookupStopCallback, exitCallback }) => {

  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState([]);

  const handleLookupClick = async (event) => {
    event.preventDefault();
    const result = await stopSearch(query);
    setMatches(result);
  }

  return (
    <div className={'stop-lookup'}>
      <div className={'map-header'}>
        <Button onClick={exitCallback}><ArrowBackIcon /></Button>
        <small>{'Search for a stop by intersection'}</small>
      </div>
      <form onSubmit={handleLookupClick} className={'stop-input-form'}>
        <TextField
          value={query}
          variant={'standard'}
          className={'stop-input-form__text-input'}
          onLoad={ (event) => event.target.focus() }
          onChange={ (event) => setQuery(event.target.value) }
        />
        <div className={'stop-input-form__buttons'}>
          <Button 
            onClick={handleLookupClick} 
            size={'small'}
            variant={'contained'} 
          >
            {'Search'}
          </Button>
        </div>
      </form>
      {
        matches.length > 0 ?
        <TableContainer>
          <Table className={'stop-lookup-table'}>
            <TableBody>
              {matches.map(match => 
                <TableRow key={match.item.Id} className={'stop-lookup-table__row'}>
                  <TableCell>{match.item.Id}</TableCell>
                  <TableCell>{match.item.Name}</TableCell>
                  <TableCell>
                    <Button 
                      size={'small'} 
                      variant={'contained'}
                      onClick={() => lookupStopCallback(match.item.Id)}
                    >
                      {'Select'}
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        : <div></div>
      }
    </div>
  );
}