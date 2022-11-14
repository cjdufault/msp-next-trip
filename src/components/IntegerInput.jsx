import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';

export const IntegerInput = ({ value, onChange }) => {
  const regexp = new RegExp(`^-?[0-9]*$`);
  const [internalValue, setInternalValue] = useState(value);
  return (
    <TextField
      value={ internalValue }
      onChange={ (event) => {
        const newValue = event.target.value;
        if (regexp.test(newValue)) {
          setInternalValue(newValue);
          onChange(newValue);
        }
      }}
      onBlur={ () => {
        setInternalValue(value);
      }}
    />
  );
};