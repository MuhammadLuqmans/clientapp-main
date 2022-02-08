import { Button, debounce, InputLabel, LinearProgress, MenuItem, Select, TextField } from '@material-ui/core';
import { Autocomplete } from '@mui/material';
import { Field, Form, Formik, useFormik } from 'formik';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import SelectDropdown from '../../common/SelectDropdown';
import { useStores } from '../../hooks/use-stores';
import { IWatchlistItem } from '../../interfaces/interfaces';
import AuthService from '../../services/auth-service';
import { getQuotesClient } from '../../services/ibwatchdog-api.service';
import { ISearchData, searchSymbol } from '../../services/symbol-service';
import { WatchlistItem } from '../../stores/watchlist-store';
import { SecurityType } from '../../utilities/contract.utilities';
import OptionsDataGrid from './OptionsDataGrid';

interface IProps {
  account: string;
  securityType: SecurityType;
}

const OptionSelection: React.FC<IProps> = ({
  account,
  securityType,
}) => {
  const [side, setSide] = useState<'C' | 'P'>('C');
  const [showOptionMatrix, setShowOptionMatrix] = useState(false);
  const [showOptionFilters, setShowOptionFilters] = useState(false);
  const [expirations, setExpirations] = useState<string[]>(null);
  const [selectedExpiration, setSelectedExpiration] = useState("");

  const {
    mutate: feedData,
    isSuccess: loaded,
    data: searchData,
    isLoading: isSearching,
    status,
  } = useMutation('search-instruments', searchSymbol);

  const { WatchlistStore } = useStores();

  const handleChange = debounce((text: string) => {
    feedData({ account: account, pattern: text, secType: securityType });
  }, 1000);

  const autocompleteChangeHandler = async (event, value: any) => {
    console.log("autocompleteChangeHandler");
    if (value && searchData && searchData.results) {
      searchData.results.map(async (item) => {
        if (item.symbol.localeCompare(value.symbol) === 0) {
          const wc: IWatchlistItem = {
            secType: securityType,
            symbol: item.symbol,            
            description: item.description
          };

          WatchlistStore.SetOptionSymbol(wc as WatchlistItem);

          const client = getQuotesClient(AuthService.currentUser?.token);
          const res = await client.expirations(account, wc.secType, wc.symbol);
          setExpirations(res.expirations);
          setShowOptionFilters(true);
        }
      });
    }
  };

  const renderAutocompleteSearch = (secType: SecurityType) => {
    return (
      <Autocomplete
        id='combo-box-demo'
        clearOnBlur={true}
        options={
          loaded && searchData?.results !== null ? searchData?.results : ['']
        }
        filterOptions={(options, state) => options}
        getOptionLabel={(option: any) => {
          if (secType === SecurityType.FOP) return option.symbol;

          return option.description;
        }}
        onChange={autocompleteChangeHandler}
        onInputChange={(event, value, reason) => {
          console.log("handleCHange", value);
          if (value.length >= 2 && reason !== 'reset') {
            handleChange(value);
          }
        }}
        renderInput={(params) => {
          return (
            <>
              {isSearching && <LinearProgress />}
              <TextField {...params} label='Search instrument' />
            </>
          );
        }}
      />
    );
  };

  const renderOptionFilters = (secType: SecurityType) => {
    return (
      <div style={{ display: 'flex', marginTop: '20px' }}>
        <SelectDropdown
          label='Side'
          data={['C', 'P']}
          setData={setSide}
        />
        <SelectDropdown
          label="Expirations"
          initialSelection={expirations[0]}
          data={expirations}
          setData={(data) => {
            setSelectedExpiration(data);
          }}
        />
        <Button onClick={() => {
          if (selectedExpiration === "") setSelectedExpiration(expirations[0]);
          setShowOptionMatrix(true);
        }}>
          Load
        </Button>
      </div>
    );
  };

  const renderSearch = (secType: SecurityType) => {
    switch (secType) {
      case SecurityType.FOP:
      case SecurityType.OPT:
        return (
          <>
            {renderAutocompleteSearch(secType)}
            {showOptionFilters && renderOptionFilters(secType)}
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      {renderSearch(securityType)}
      {
        showOptionMatrix &&
        <OptionsDataGrid
          account={account}
          side={side}
          expirationDate={selectedExpiration}
          isSearching={isSearching}
        />
      }
    </>
  );
};

export default observer(OptionSelection);
