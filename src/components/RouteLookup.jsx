import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export const RouteLookup = ({ lookupRouteCallback, exitCallback }) => {

  const [internalValue, setInternalValue] = useState('');
  const [routeId, setRouteId] = useState('');

  const handleLookupClick = () => {
    if (routeId !== '') {
      lookupRouteCallback(routeId, null);
    }
  };

  const handleRouteInputChange = (newValue) => {
    setRouteId(newValue);
  };

  return (
    <div className={'route-lookup'}>
      <div className={'map-header'}>
        <Button onClick={exitCallback}><strong>{'X'}</strong></Button>
        <small>{'Enter a route number below to view a map of the route.'}</small>
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