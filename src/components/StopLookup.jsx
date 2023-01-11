import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { stopSearch } from '../data/stopSearch';

export const StopLookup = ({ lookupStopCallback, exitCallback }) => {

  const [query, setQuery] = useState('');

  const handleLookupClick = async () => {
    const result = await stopSearch(query);
    console.log(result);
  }

  return (
    <div className={'stop-lookup'}>
      <div className={'map-header'}>
        <Button onClick={exitCallback}><strong>{'X'}</strong></Button>
        <small>{'Search for a stop'}</small>
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
            {'Lookup'}
          </Button>
        </div>
      </form>
    </div>
  );
}