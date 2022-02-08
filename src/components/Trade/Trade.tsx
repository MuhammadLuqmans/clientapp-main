/* eslint-disable react/display-name */
import { Field, Form, Formik } from 'formik';
import { useParams } from 'react-router';
import { useMutation, useQuery } from 'react-query';
import { observer } from 'mobx-react';
import {
  DataGridPro,
  GridActionsCellItem,
  GridApiRef,
  GridEvents,
  GridRenderCellParams,
  GridToolbar,
  GridToolbarContainer,
  useGridApiContext,
  useGridApiRef,
  useGridSelector,
  gridFilteredDescendantCountLookupSelector,
  GridCellParams,
  DataGridProProps
} from '@mui/x-data-grid-pro';
import DeleteIcon from '@mui/icons-material/Delete';

import { LocalAtm, RemoveCircleOutline as RemoveIcon } from '@material-ui/icons';
import { autorun } from 'mobx';
import { useCallback, useEffect, useState } from 'react';
import { Box, ButtonGroup, Chip, TextField } from '@material-ui/core';
import { useStores } from '../../hooks/use-stores';
import Button from '../../common/Button';
import OrderModal from '../OrderModal/OrderModal';
import { createTrade, ICreateTradeData } from '../../services/trade-service';
import { isNavigationKey } from '../../utilities/utils';
import { ITradeViewModel, TradeType, TradeViewModel } from '../../swagger-clients/ibwatchdog-api-clients.service';

export interface ICreateTradeRow {
  id: number,
  hierarchy: string[];
  tradeId: string;
  symbol: string;
  secType: string;
  expirationDate: string,
  thesis: string;
}

interface EditToolbarProps {
  apiRef: GridApiRef;
  trade: ITradeViewModel;
}

const CreateTrade = () => {
  const [rows, setRows] = useState<ICreateTradeRow[]>([]);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [trade, setTrade] = useState<ITradeViewModel>(undefined);
  const [message, setMessage] = useState<string>(undefined);
  const [selectedTradeRow, setSelectedTradeRow] = useState<ICreateTradeRow>(undefined);
  const { accountName, tradeId } = useParams<any>();
  const apiRef = useGridApiRef();
  const { TradeStore } = useStores();


  // maps store trade entries to datagrid
  useEffect(
    () =>
      autorun(() => {
        if (TradeStore.selectedTrade !== undefined) {
          const tradeRows = [];

          tradeRows.push({
            id: new Date().valueOf(),
            tradeId: TradeStore.selectedTrade.tradeId,
            hierarchy: TradeStore.selectedTrade.displayHierarchy,
            symbol: TradeStore.selectedTrade.symbol,
            secType: TradeStore.selectedTrade.secType,
            strike: TradeStore.selectedTrade.strike,
            expirationDate: TradeStore.selectedTrade.expirationDate
          });

          TradeStore.selectedTrade.legs?.map((trade) => {
            tradeRows.push({
              id: new Date().valueOf(),
              tradeId: trade.tradeId,
              hierarchy: trade.displayHierarchy,
              symbol: trade.symbol,
              secType: trade.secType,
              expirationDate: TradeStore.selectedTrade.expirationDate
            } as ICreateTradeRow); //todo push rest
          });
          setRows(tradeRows);
        }
      }),
    []
  );

  const deleteTrade = useCallback(
    (tradeRow: ICreateTradeRow) => () => {
      setTimeout(() => {
        if (tradeRow.tradeId === TradeStore.selectedTrade.tradeId) {
          TradeStore.RemoveTradeById(tradeRow.tradeId);
          setRows([]);
        } else {
          TradeStore.RemoveTradeById(tradeRow.tradeId);
          setRows((prevRows) =>
            prevRows.filter((row) => row.tradeId !== tradeRow.tradeId)
          );
        }
      });
    },
    []
  );

  const columns = [
    { field: 'id', hide: true },
    {
      field: 'symbol',
      headerName: 'Symbol',
      type: 'string',
      width: 150,
    },
    {
      field: 'secType',
      headerName: 'Security Type',
      type: 'string',
      width: 150,
    },
    {
      field: 'expirationDate',
      headerName: 'Expiration Date',
      type: 'string',
      width: 150,
    },
    {
      field: 'right',
      headerName: 'Right',
      type: 'string',
      width: 150,
    },
    {
      field: 'orders',
      headerName: 'Orders',
      width: 150,
      type: 'actions',
      getActions: (params: GridRenderCellParams) => [
        <>
          {params.row !== null && (
            <Button
              variant="text"
              key='1'
              //disabled={trade === undefined}
              onClick={() => {
                setSelectedTradeRow(params.row as ICreateTradeRow);
                setShowOrderModal(true);
              }}
            >
              <Chip icon={<LocalAtm />} label="Orders" />
            </Button>
          )}
        </>,
      ],
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key='deleteTrade'
          icon={<DeleteIcon />}
          label='Delete'
          onClick={deleteTrade(params.row)}
        />,
      ],
    },
  ];

  const buttons = [
    <Button key="one" style={{ color: "blue" }} onClick={() => { TradeStore.selectedTrade.tradeType = TradeType.CHASE; }}>{TradeType.CHASE}</Button>,
    <Button key="two" style={{ color: "blue", marginLeft: 5, marginRight: 5 }} onClick={() => { TradeStore.selectedTrade.tradeType = TradeType.SWING; }}>{TradeType.SWING}</Button>,
    <Button key="three" style={{ color: "blue" }} onClick={() => { TradeStore.selectedTrade.tradeType = TradeType.TREND; }}>{TradeType.TREND}</Button>,
  ];

  function AddToolbar(props: EditToolbarProps) {
    const { apiRef } = props;

    return (
      <GridToolbarContainer>
        <TextField
          id="thesis"
          label="Thesis"
          variant="outlined"
          fullWidth
          onChange={(e: any) => {
            TradeStore.selectedTrade.thesis = e.target.value;
          }}
        />
        <ButtonGroup color="secondary" style={{ marginLeft: 20, textDecorationColor: "blue" }} aria-label="button group">
          {buttons}
        </ButtonGroup>
      </GridToolbarContainer>
    );
  }

  const { mutate, isLoading: postLoading } = useMutation(createTrade, {
    onSuccess: (trade: TradeViewModel) => {
      if(trade) {
        console.log("onSuccess", trade);
        setTrade(trade);
      }      
    },
    onError: (error: any) => {
      console.log("trade error!", error);
      setMessage(error);
    }
  });

  const onSubmitHandler = (e: any) => {
    console.log("onSubmitHandler", e);
    console.dir(TradeStore.selectedTrade);

    const data: ICreateTradeData = {
      account: accountName,
      model: TradeStore.selectedTrade,
    };

    mutate(data);
  };

  return (
    <div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          apiRef={apiRef}
          treeData
          getTreeDataPath={(row) => {
            return row.hierarchy;
          }}
          groupingColDef={groupingColDef}
          components={{
            Toolbar: AddToolbar,
          }}
          componentsProps={{
            toolbar: { apiRef },
          }}
          rowHeight={25}
        />
      </div>
      <Button key="one" style={{ color: "blue" }} onClick={(e) => { onSubmitHandler(e); }}>Create</Button>
      {showOrderModal && (
        <OrderModal
          tradeId={selectedTradeRow.tradeId}
          isOpen={showOrderModal}
          setIsOpen={setShowOrderModal}
          title='Orders'
        />
      )}
    </div>
  );
};

export const groupingColDef: DataGridProProps['groupingColDef'] = {
  headerName: 'Trade Legs',
  renderCell: (params) => <CustomGridTreeDataGroupingCell {...params} />,
};

export const CustomGridTreeDataGroupingCell = (props: GridRenderCellParams) => {
  const { id, field, rowNode } = props;
  const apiRef = useGridApiContext();
  const filteredDescendantCountLookup = useGridSelector(
    apiRef,
    gridFilteredDescendantCountLookupSelector,
  );
  const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;

  const handleKeyDown = (event) => {
    if (event.key === ' ') {
      event.stopPropagation();
    }
    if (isNavigationKey(event.key) && !event.shiftKey) {
      apiRef.current.publishEvent(GridEvents.cellNavigationKeyDown, props, event);
    }
  };

  const handleClick = (event) => {
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation();
  };

  return (
    <Box sx={{ ml: rowNode.depth * 4 }}>
      <div>
        {filteredDescendantCount > 0 ? (
          <Button
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            size="small"
          >
            Open {filteredDescendantCount} legs
          </Button>
        ) : (
          <span />
        )}
      </div>
    </Box>
  );
};

export default observer(CreateTrade);
