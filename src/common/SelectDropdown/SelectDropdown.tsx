import { InputLabel } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React, { useState } from 'react';
import { useDidFirstRenderEffect } from '../../hooks';
import { useStyles } from './SelectDropdown.style';

interface ISelectDropdown {
  label?: string;
  data: any;
  initialSelection?: any;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  disabled?: boolean;
}

const SelectDropdown: React.FC<ISelectDropdown> = ({
  label,
  data,
  initialSelection,
  setData,
  disabled,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(
    initialSelection
      ? data.filter((value: string) => value === initialSelection)[0]
      : data[0]
  );

  useDidFirstRenderEffect(() => {
    setValue(data[0]);
  }, [data[0]]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as string);
    setData && setData(event.target.value);
  };

  return (
    <FormControl className={classes.formControl} variant='outlined'>
      <InputLabel id='SelectDropdown'>{label}</InputLabel>
      <Select        
        labelId='SelectDropdown'
        id='SelectDropdown'
        label={label}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={classes.select}
      >
        {data.map((item: any, key: number) => (
          <MenuItem key={key} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectDropdown;
