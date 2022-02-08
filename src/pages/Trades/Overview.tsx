import { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useQuery } from 'react-query';
import { useParams } from "react-router";
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import { Link } from 'react-router-dom';
import { Button, Container, makeStyles, useTheme } from '@material-ui/core';
import AuthService from '../../services/auth-service';
import { getTradesClient } from "../../services/ibwatchdog-api.service";
import Layout from '../../components/Layout';
import { groupingColDef } from "../../components/Trade/Trade";
import { Quote, TradeType, TradeViewModel } from "../../swagger-clients/ibwatchdog-api-clients.service";

interface ITradeOverviewEntry {
    id: number,
    tradeId: string;
    thesis: string | undefined;
    tradeType: TradeType | undefined;
    quote: Quote;
    displayHierarchy: string[] | undefined;
    underlyingEntryPrice?: number | undefined;
    underlyingStopLoss?: number[] | undefined;
    underlyingTakeProfit?: number[] | undefined;
    tactic: string;
    entryPrice?: number | undefined;
    exitPrice?: number | undefined;
    percentageSold?: number | undefined;
    entryDate?: string | undefined;
    exitDate?: string | undefined;
    size?: number | undefined;
    realized: number;
    unrealized: number;
    total: number;
    shares: number;    
    notes: string[] | undefined;
}

const Trades = ({ TradeStore }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [rows, setRows] = useState<ITradeOverviewEntry[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(25);
    const { accountName } = useParams<any>();
    const apiRef = useGridApiRef();

    const { data, status, error, isFetching } = useQuery('trades', async () => {
        const client = getTradesClient(AuthService.currentUser?.token);
        return await client.getAll(accountName, "ACTIVE");
    }, {
        refetchInterval: 10000,
        onSuccess: () => {
            console.log('trades fetched with no problems', data);
            if (data && data.length > 0) {
                getTableRows(data);
            }
        },
    });

    const getSymbolDataColumn = (
        trade: ITradeOverviewEntry
    ): JSX.Element => {
        return (
            <Link to={`/accounts/${accountName}/trader-portal/${trade?.id}`}>
                {trade.quote.symbol}
            </Link>
        );
    };

    const columns = [
        {
            title: 'Symbol',
            field: 'symbol',
            render: (rowData) => { return getSymbolDataColumn(rowData); }
        },
        {
            title: 'Tactic',
            field: 'tactic'
        },
        {
            title: 'Thesis',
            field: 'thesis'
        },
        {
            title: 'UnderlyingEntryPrice',
            field: 'underlyingEntryPrice'
        },
        {
            title: 'UnderlyingStopLoss',
            field: 'underlyingStopLoss'
        },
        {
            title: 'UnderlyingTakeProfit',
            field: 'underlyingTakeProfit'
        },
        {
            title: 'EntryPrice',
            field: 'entryPrice'
        },
        {
            title: 'Date Entered',
            field: 'dateEntered'
        },
        {
            title: 'ExitPrice',
            field: 'exitPrice'
        },
        {
            title: 'Percentage Sold',
            field: 'percentageSold'
        },
        {
            title: 'Realized',
            field: 'realized'
        },
        {
            title: 'UnRealized',
            field: 'unrealized'
        }
    ];

    const getTableRows = (trades: TradeViewModel[]) => {
        const tradeRows = trades.map((trade: TradeViewModel) => {            
            return ({
                id: new Date().valueOf(),
                hierarchy: trade.displayHierarchy,
                thesis: trade.thesis,                
                tactic: trade.tactic,
                symbol: trade.quote.symbol,
                underlyingEntryPrice: "$" + trade.underlyingEntryPrice[0], //todo parse array
                underlyingStopLoss: "$" + trade.underlyingStopLoss[0], //todo parse array 
                entryPrice: "$" + trade.entryPrice,
                exitPrice: "$" + trade.exitPrice && "",
                dateEntered: trade.entryDate,
                percentageSold: trade.percentageSold,
                realized: trade.realized,
                unrealized: trade.unrealized,
            } as unknown as ITradeOverviewEntry);
        });

        setRows(tradeRows);
    };

    return (
        status === "success" &&
        <>
            <Layout />
            <Container>
                <DataGridPro
                    disableSelectionOnClick={true}
                    rows={rows}
                    columns={columns}
                    apiRef={apiRef}
                    treeData
                    getTreeDataPath={(row) => {
                        return row.hierarchy;
                    }}
                    groupingColDef={groupingColDef}
                    rowHeight={25}
                    hideFooterRowCount
                />
            </Container>
        </>
    );
};

export default observer(Trades);