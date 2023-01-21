import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const RouteLookup = ({ lookupRouteCallback, exitCallback }) => {

  const [internalValue, setInternalValue] = useState('');
  const [routeId, setRouteId] = useState('');

  const handleLookupClick = () => {
    if (routeId !== '') {
      lookupRouteCallback(routeId, null);
    }
  };

  const handleRouteInputChange = (newValue) => {
    setRouteId(newValue.trim());
  };

  return (
    <div className={'route-lookup'}>
      <div className={'map-header'}>
        <IconButton onClick={exitCallback}><ArrowBackIcon /></IconButton>
        <small>{'Search for a map by entering the route number.'}</small>
      </div>
      <form onSubmit={handleLookupClick} className={'stop-input-form'}>
        <TextField
          value={ internalValue }
          variant={'standard'}
          className={'stop-input-form__text-input'}
          onChange={ (event) => {
            const newValue = event.target.value;
            setInternalValue(newValue);
            handleRouteInputChange(newValue);
          }}
          onLoad={ (event) => {
            event.target.focus();
          }}
          onBlur={ () => {
            setInternalValue(routeId);
          }}
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
  )
}