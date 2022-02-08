import { Button, debounce, InputLabel, TextField } from '@material-ui/core';
import { Autocomplete } from '@mui/material';
import { observer } from 'mobx-react';
import { useMutation } from 'react-query';
import { useStores } from '../../hooks/use-stores';
import { IWatchlistItem } from '../../interfaces/interfaces';
import { searchSymbol } from '../../services/symbol-service';
import { WatchlistItem } from '../../stores/watchlist-store';
import { SecurityType } from '../../utilities/contract.utilities';
import LoadingIndicator from '../LoadingIndicator';
import DefaultDataGrid from './DefaultDataGrid';

interface IDefaultSelectionProps {
  account: string;
  securityType: SecurityType;
}

const DefaultSelection: React.FC<IDefaultSelectionProps> = ({
  account,
  securityType,
}) => {
  const { WatchlistStore } = useStores();
  const {
    mutate: feedData,
    isSuccess: loaded,
    data: searchData,
    isLoading: isSearching,
    status,
  } = useMutation('search-instruments', searchSymbol);

  const handleChange = debounce((text: string) => {
    feedData({ account: account, pattern: text, secType: securityType });
  }, 1000);

  const autocompleteChangeHandler = async (event, value: any) => {
    console.log("test", value);
    if (value) {
      searchData.results.map((item) => {
        if (securityType === SecurityType.FUT) {
          if (item.description.localeCompare(value.description) === 0) {
            const wc: IWatchlistItem = {
              secType: securityType,
              symbol: item.symbol,
              description: item.description,
              expirationDate: item.expiration,
            };
            WatchlistStore.Add(wc as WatchlistItem);
          }
        } else {
          if (item.symbol.localeCompare(value.symbol) === 0) {
            const wc: IWatchlistItem = {
              secType: securityType,
              symbol: item.symbol,
              description: item.description,
              expirationDate: item.expiration,
            };
            WatchlistStore.Add(wc as WatchlistItem);
          }
        }
      });
    }
  };

  const renderAutocompleteSearch = () => {
    return (
      <>
        {isSearching && <LoadingIndicator />}
        <Autocomplete
          id='combo-box-demo'
          clearOnBlur={true}
          options={
            loaded && searchData !== null && searchData.results !== null ? searchData.results : ['']
          }
          filterOptions={(options, state) => options}
          getOptionLabel={(option: any) => { return option.description; }}
          onChange={autocompleteChangeHandler}
          onInputChange={(event, value, reason) => {
            if (value.length >= 2 && reason !== 'reset') {
              handleChange(value);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label='Search instrument' />
          )}
        />
      </>
    );
  };

  const renderSearch = (secType: SecurityType) => {
    switch (secType) {
      case SecurityType.FUT:
      case SecurityType.STK:
        return (
          renderAutocompleteSearch()
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      {renderSearch(securityType)}
      <DefaultDataGrid
        account={account}
      />
    </>
  );
};

export default observer(DefaultSelection);
