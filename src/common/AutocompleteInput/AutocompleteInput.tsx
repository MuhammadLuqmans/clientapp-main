import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Error, InputContainer, useStyles } from './AutocompleteInput.style';
// import { useScreenSizes } from 'hooks';

interface IAutocompleteInputProps {
  label: string;
  data: any;
  onSelect: (value: any) => void;
  setFilterQuery: any;
  onFilterData: () => void;
  multiple?: boolean;
  field?: any;
  form?: any;
  name?: string;
  selectedData?: any;
  disabledDataHandler?: any;
  setFieldValue?: any;
}
const AutocompleteInput: React.FC<IAutocompleteInputProps> = ({
  label,
  data,
  onSelect,
  multiple = false,
  selectedData,
  setFilterQuery,
  onFilterData,
  disabledDataHandler,
  field,
  form,
  name,
  setFieldValue,
}) => {
  const [text, setText] = useState<string | undefined>(undefined);
  const [debouncedValue] = useDebounce(text, 300);
  const classes = useStyles();
  //   const { isMobileScreen } = useScreenSizes();

  useEffect(() => {
    // refetch on input search
    if (debouncedValue !== undefined) onFilterData();
  }, [debouncedValue]);

  const fieldName = name || field?.name;

  return (
    <>
      <Autocomplete
        multiple={multiple}
        value={selectedData}
        freeSolo
        filterSelectedOptions
        renderTags={() => null}
        options={data}
        getOptionLabel={(option: any) => option.name || ''}
        getOptionDisabled={disabledDataHandler} //to prevent selecting already selected option
        onChange={(_e, value) => {
          onSelect(value);
          setFieldValue && setFieldValue(fieldName, value);
        }}
        classes={{ clearIndicatorDirty: classes.clearIndicatorDirty }}
        id={fieldName}
        defaultValue={selectedData}
        renderInput={(params: any) => (
          <InputContainer
          //   isMobileScreen={isMobileScreen}
          >
            <TextField
              {...params}
              {...field}
              name={fieldName}
              id={fieldName}
              variant='outlined'
              label={label}
              onChange={(e) => {
                setText(e.target.value);
                setFilterQuery(e.target.value);
              }}
            />
            {/* {!selectedData && <SearchIcon color='disabled' />} */}
          </InputContainer>
        )}
      />
      {form?.touched[fieldName] && form?.errors[fieldName] && (
        <Error>{form?.errors[fieldName]}</Error>
      )}
    </>
  );
};

export default AutocompleteInput;
