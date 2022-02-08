import {
  Checkbox as MaterialChecbox,
  CheckboxProps,
  useTheme,
} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import React from 'react';
import { CheckboxContainer } from './Checkbox.style';

interface IChecboxProps {
  label: string;
  checked?: boolean;
  onChange?: () => void;
}

const Checkbox: React.FC<IChecboxProps & CheckboxProps> = ({
  label,
  checked = false,
  onChange,
  ...checkboxProps
}) => {
  const theme = useTheme();

  return (
    <CheckboxContainer color={theme.palette.primary.main}>
      <FormGroup row>
        <FormControlLabel
          control={
            <MaterialChecbox
              checked={checked}
              onChange={onChange}
              color='primary'
              {...checkboxProps}
            />
          }
          label={label}
        />
      </FormGroup>
    </CheckboxContainer>
  );
};

export default Checkbox;
