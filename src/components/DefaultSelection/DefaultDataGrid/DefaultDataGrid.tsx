/* eslint-disable react/display-name */

import { Button } from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    DataGridPro,
    GridCellParams,
    GridColumns,
    GridRenderCellParams,
    GridRowData,
    useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import LoadingIndicator from '../../LoadingIndicator';
import AuthService from '../../../services/auth-service';
import { getAccountsClient, getQuotesClient } from '../../../services/ibwatchdog-api.service';
import CustomFooterStatusComponent from "../../Connection/ConnectionStatus";
import { makeId, getHash, removeByValue } from "../../../utilities/utils";
import { useStores } from '../../../hooks/use-stores';
import { ExecutionType, OrderType, QuoteQuery, TimeInForce, TradeType } from '../../../swagger-clients/ibwatchdog-api-clients.service';
import { useInterval } from '../../../hooks/use-interval';
import { OrderAction } from '../../../utilities/order.utilities';
import { CreateTradeDto } from '../../../stores/trades-store';

interface IProps {
    account: string,
}

const DefaultDataGrid: React.FC<IProps> = ({
    account,
}) => {
    const [rows, setRows] = useState<[]>([]);

    const apiRef = useGridApiRef();
    const access_token = AuthService.currentUser?.token;
    const quotesClient = getQuotesClient(access_token);
    const { WatchlistStore, TradeStore } = useStores();

    const fetchWatchlist = async () => {
        //todo add so it supports futures
        const params = WatchlistStore.watchlistItems.map(s => ({ secType: s.secType, symbol: s.symbol, expirationDate: s.expirationDate } as QuoteQuery));
        return await quotesClient.quotes(account, params);
    };

    useEffect(() => autorun(() => {
        console.log("mutate", WatchlistStore);
        if (WatchlistStore.watchlistItems.length > 0) {
            mutate();
        }
    }), []);

    const successFn = (data) => {
        if (data && data.quotes && data.quotes.length > 0) {
            const rows = data.quotes.map(contract => ({
                id: getHash(contract.symbol),
                volume: contract.volume,
                ask: contract.ask,
                bid: contract.bid,
                open: contract.open,
                close: contract.close,
                last: contract.last,
                symbol: contract.symbol,
                description: contract.description,
                secType: contract.secType,
                expirationDate: contract.expirationDate,
                low: contract.low,
                high: contract.high,
                openChangePercent: contract.openChangePercent,
            }));
            console.log(rows);
            setRows(rows);
        }
    };

    const failureFn = () => {
        console.log("interval success");
    };

    const { mutate, data, isLoading, isFetching } = useInterval("pollWatchlist", fetchWatchlist, successFn, failureFn);

    // adds stocks / futures to selected trade
    const addToTrade = (row) => {
        const ws = WatchlistStore.watchlistItems?.find((element, index) => {
            if (element.symbol.localeCompare(row.symbol) === 0) return true;
        });

        console.log("row", row);
        const isLeg = TradeStore.selectedTrade !== undefined;

        const trade: CreateTradeDto = {
            account: account,
            tradeId: uuidv4(),
            symbol: row.symbol,
            secType: row.secType,
            description: row.description,
            expirationDate: row.expirationDate,
            legs: [],
            displayHierarchy: ['0'],
        };

        if (isLeg) {
            trade.displayHierarchy.push('1');
            trade.parentTradeId = TradeStore.selectedTrade.tradeId;
            TradeStore.AddTradeLeg(trade);
            return;
        }

        TradeStore.SetSelectedTrade(trade);
        console.log("TradeStore.selectedTrade", TradeStore.selectedTrade);
    };

    const getSymbolDataColumn = (params: GridRenderCellParams): JSX.Element => {
        return (
            <Button variant="text" onClick={() => addToTrade(params.row)}>{params.row.symbol}</Button>
        );
    };

    const getActionsDataColumn = (params: GridRenderCellParams): JSX.Element => {
        return (
            <Button onClick={() => {
                const wc = WatchlistStore.watchlistItems?.find(wc => wc.symbol == params.row.symbol);
                WatchlistStore.Remove(wc);
                apiRef.current.updateRows([
                    {
                        id: getHash(wc.symbol),
                        _action: "delete"
                    },
                ]);
            }}><DeleteIcon /></Button>
        );
    };

    const columns: GridColumns = [
        { field: 'id', headerName: 'ID', hide: true },
        {
            field: 'symbol',
            headerName: 'Symbol',
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => { return getSymbolDataColumn(params); }
        },
        { field: 'expirationDate', hide: true },
        { field: 'secType', hide: true },
        {
            field: 'bid',
            headerName: 'Bid',
            flex: 1,
        },
        {
            field: 'ask',
            headerName: 'Ask',
            flex: 1,
        },
        {
            field: 'open',
            headerName: 'Open',
            flex: 1,
        },
        {
            field: 'close',
            headerName: 'Close',
            flex: 1,
        },
        {
            field: 'volume',
            headerName: 'Volume',
            flex: 1,
        },
        {
            field: 'last',
            headerName: 'Last',
            flex: 1,
        },
        {
            field: 'low',
            headerName: 'Low',
            flex: 1,
        },
        {
            field: 'high',
            headerName: 'High',
            flex: 1,
        },
        {
            field: 'openChangePercent',
            headerName: 'OpenChange%',
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Action',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => { return getActionsDataColumn(params); }
        },
    ];

    return (
        <div>
            <div
                style={{
                    marginTop: 20,
                    height: 400,
                    width: '100%',
                }}
            >
                {(isLoading || isFetching) && <LoadingIndicator />}
                <DataGridPro
                    rows={rows}
                    columns={columns}
                    apiRef={apiRef}
                    rowHeight={25}
                    components={{
                        Footer: CustomFooterStatusComponent,
                    }}
                />
            </div>
        </div>
    );
};

export default observer(DefaultDataGrid);
