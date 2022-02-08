import { TextField, TextFieldProps } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import React from 'react';
import { useScreenSizes } from '../../hooks';
import { Container } from './Input.style';

interface IProps {
  inputType?: 'default' | 'search';
  value: string | undefined;
  setValue: (e: string) => void;
  label: string;
}

const Input: React.FC<IProps & TextFieldProps> = ({
  inputType = 'default',
  value,
  setValue,
  label,
  ...inputProps
}) => {
  const { isTabletScreen } = useScreenSizes();

  return (
    <Container isTabletScreen={isTabletScreen}>
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label={label}
        id='outlined'
        type={inputType}
        variant='outlined'
        style={{ width: '100%' }}
        {...inputProps}
      />
      {inputType === 'search' && <SearchIcon />}
    </Container>
  );
};

export default Input;
