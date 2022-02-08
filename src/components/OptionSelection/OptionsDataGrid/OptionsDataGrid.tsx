import { Button, LinearProgress } from '@mui/material';
import {
  DataGridPro,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { v4 as uuidv4 } from 'uuid';
import { autorun } from 'mobx';
import AuthService from '../../../services/auth-service';
import { SecurityType } from '../../../utilities/contract.utilities';
import CustomFooterStatusComponent from "../../Connection/ConnectionStatus";

import { useStores } from '../../../hooks/use-stores';
import { useInterval } from '../../../hooks/use-interval';
import { ExecutionType, OrderType, TimeInForce, TradeType } from '../../../swagger-clients/ibwatchdog-api-clients.service';
import { CreateTradeDto } from '../../../stores/trades-store';
import { getQuotesClient } from '../../../services/ibwatchdog-api.service';

interface IProps {
  account: string,
  side: 'C' | 'P';
  expirationDate: string;
  isSearching: boolean;
}

const OptionsDataGrid: React.FC<IProps> = ({
  account: account,
  side,
  expirationDate,
  isSearching
}) => {
  const apiRef = useGridApiRef();
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<[]>([]);
  const { WatchlistStore, TradeStore } = useStores();
  const access_token = AuthService.currentUser?.token;
  const contractsClient = getQuotesClient(access_token);

  const fetchOptionMatrix = async () => {
    return await contractsClient.optionsMatrixData(
      account,
      50,
      page,
      WatchlistStore.optionItem.secType == SecurityType.FOP ? "FUT" : "STK",      
      WatchlistStore.optionItem.symbol,
      undefined, //strike
      side,
      expirationDate,
      undefined, //exchange     
    );
  };

  const successFn = (response) => {
    if (response) {
      const rows = response.map(item => ({
        id: item.id,
        symbol: item.symbol,
        display: item.display,
        strike: item.strike,
        expirationDate: item.expirationDate,
        secType: item.secType,
        right: item.right,
        iv: item.impliedVolatility,
        percentageChangeOpen: item.openChangePercent,
        volume: item.volume,
        bid: item.bid,
        ask: item.ask,
        prevClose: item.previousClose,
        low: item.low,
        high: item.high,
        delta: item.delta,
        gamma: item.gamma,
        vega: item.vega,
        theta: item.theta
      }));
      setRows(rows);
    }
  };

  const failureFn = () => {
    console.log("interval failure");
  };

  const { mutate, data, isLoading, isFetching } = useInterval("pollOptionsMatrix", fetchOptionMatrix, successFn, failureFn);

  // useEffect(() => autorun(() => {
  //   console.log("mutate", WatchlistStore);
  //   if (WatchlistStore.optionItem !== undefined) {
  //     mutate();
  //   }
  // }), []);

  useEffect(() => {
    mutate();
  }, [page, side, expirationDate]);

  const isLeg = TradeStore.selectedTrade !== undefined;

  const addToTrade = (row) => {
    console.log("row", row);

    //fill object from row not from store
    const trade: CreateTradeDto = {
      tradeId: uuidv4(),
      account: account,
      symbol: row.symbol,
      secType: row.secType,
      strike: row.strike,      
      description: row.display,
      expirationDate: row.expirationDate,
      right: row.right,
      legs: [],
      displayHierarchy: ['0'],
    };

    if (TradeStore.selectedTrade !== undefined) {
      trade.displayHierarchy.push('1');
      trade.parentTradeId = TradeStore.selectedTrade.tradeId;
      TradeStore.AddTradeLeg(trade);
      return;
    }

    TradeStore.SetSelectedTrade(trade);
  };

  const getSymbolDataColumn = (params: GridRenderCellParams): JSX.Element => {
    return (
      <>
        <Button
          onClick={() => addToTrade(params.row)}
        >
          {params.row.display}
        </Button>
      </>
    );
  };

  const columns = [
    { field: 'id', hide: true },
    { field: 'symbol', hide: true },
    { field: 'secType', hide: true },
    { field: 'strike', hide: true },
    { field: 'expirationDate', hide: true },
    { field: 'right', hide: true },
    {
      field: 'display',
      headerName: 'Name',
      width: 250,
      renderCell: (params: GridRenderCellParams) => { return getSymbolDataColumn(params); }
    },
    { field: 'iv', headerName: 'Implied volatility', width: 75 },
    { field: 'percentageChangeOpen', headerName: '%ChangeOpen', width: 75 },
    { field: 'volume', headerName: 'Volume', width: 75, type: 'number' },
    { field: 'bid', headerName: 'Bid', width: 75 },
    { field: 'ask', headerName: 'Ask', width: 75 },
    { field: 'prevClose', headerName: 'Prev Close', width: 75 },
    { field: 'low', headerName: 'Low', width: 75 },
    { field: 'high', headerName: 'High', width: 75 },
    { field: 'delta', headerName: 'Delta', width: 75 },
    { field: 'gamma', headerName: 'Gamma', width: 75 },
    { field: 'vega', headerName: 'Vega', width: 75 },
    { field: 'theta', headerName: 'Theta', width: 75 },
  ];

  const handlePrevClick = () => {
    setPage(page - 1);
  };

  const handleNextClick = () => {
    setPage(page + 1);
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      {isLoading || isFetching || isSearching && <LinearProgress />}
      <DataGridPro
        rows={rows}
        columns={columns}
        apiRef={apiRef}
        rowHeight={25}
        components={{
          Footer: CustomFooterStatusComponent,
        }}
      />
      <Button disabled={isLoading || isFetching} onClick={handlePrevClick}>Prev</Button>
      <Button disabled={isLoading || isFetching} onClick={handleNextClick}>Next</Button>
    </div>
  );
};


export default observer(OptionsDataGrid);