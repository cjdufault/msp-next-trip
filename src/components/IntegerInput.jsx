import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';

const isValid = (value) => value !== '' && value !== '-';

export const IntegerInput = ({ value, onChange }) => {
  const regexp = new RegExp(`^-?[0-9]*$`);
  const [internalValue, setInternalValue] = useState(value);
  const [valid, setValid] = useState(isValid(value));
  return (
    <TextField
      className={ valid ? '' : 'invalid' }
      value={ internalValue }
      onChange={ (event) => {
        const newValue = event.target.value;
        if (regexp.test(newValue)) {
          setInternalValue(newValue);
          let newValid = isValid(newValue);
          setValid(newValid);
          if (newValid) {
            onChange(newValue);
          }
        }
      } }
      onBlur={ () => {
        setInternalValue(value);
        setValid(true);
      } }
    />
  );
};