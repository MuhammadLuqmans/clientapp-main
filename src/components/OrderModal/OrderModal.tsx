import 'react-datepicker/dist/react-datepicker.css';
import { observer } from 'mobx-react';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { autorun } from 'mobx';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  DataGridPro,
  GridActionsCellItem,
  GridApiRef,
  GridColumns,
  GridEditRowProps,
  GridEventListener,
  GridEvents,
  GridRenderCellParams,
  GridRowParams,
  GridToolbarContainer,
  MuiEvent,
  useGridApiRef,
  GridToolbar,
} from '@mui/x-data-grid-pro';
import { Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert/Alert';
import Slider from '@mui/material/Slider';
import { useParams } from 'react-router';
import { Divider, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import Modal from '../../common/Modal';
import {
  ExecutionType,
  OrderType,
  QuoteResult,
  TimeInForce,
  AdaptivePriority,
  TradeViewModel,
  OrderViewModel,
  CreateOrderPostModel,
} from '../../swagger-clients/ibwatchdog-api-clients.service';
import { useStores } from '../../hooks/use-stores';
import AuthService from '../../services/auth-service';
import { getQuotesClient, getOrdersClient, getTradesClient } from '../../services/ibwatchdog-api.service';
import { useInterval } from '../../hooks/use-interval';
import SelectDropdown from '../../common/SelectDropdown';
import { SecurityType } from '../../utilities/contract.utilities';
import { ICreateTradeRow } from '../Trade/Trade';

interface IOrderRow {
  id: number;
  symbol: string;
  secType: string;
  executionType: ExecutionType;
  actionType: string;
  size: number;
  price: number;
  date: Date;
  orderType: OrderType;
  timeInForce: TimeInForce,
  adaptivePriority?: AdaptivePriority;
}

interface EditToolbarProps {
  apiRef: GridApiRef;
  trade: TradeViewModel;
  orderType: OrderType;
  quote: QuoteResult;
}

interface IProps {
  tradeId: string,
  isOpen: boolean,
  setIsOpen: (value: boolean) => void,
  title: string,
}

const OrderModal: React.FC<IProps> = ({
  tradeId,
  isOpen,
  setIsOpen,
  title,
}) => {
  const [rows, setRows] = useState<IOrderRow[]>([]);
  const [trade, setTrade] = useState<TradeViewModel>(undefined);
  const [error, setError] = useState<string>(undefined);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.TRADE);
  const access_token = AuthService.currentUser?.token;
  const quotesClient = getQuotesClient(access_token);
  const ordersClient = getOrdersClient(access_token);
  const tradesClient = getTradesClient(access_token);
  const { accountName } = useParams<any>();
  const [quote, setQuote] = useState<QuoteResult>(undefined);
  const { TradeStore } = useStores();
  const apiRef = useGridApiRef();

  const hidePrice = orderType === OrderType.TIME_STOP;

  function EditToolbar(props: EditToolbarProps) {
    const { apiRef } = props;

    const handleClick = () => {
      enableOrderFecthing(false);

      const id = new Date().valueOf();
      apiRef.current.updateRows([{ id, isNew: true }]);
      apiRef.current.setRowMode(id, 'edit');
      setTimeout(() => {
        apiRef.current.scrollToIndexes({
          rowIndex: apiRef.current.getRowsCount() - 1,
        });
        apiRef.current.setCellFocus(id, 'actionType');
      });
    };

    return (
      <GridToolbarContainer>
        {/* <GridToolbar /> */}
        {trade &&
          <Button
            color='primary'
            disabled={isFetchingOrders}
            startIcon={<AddIcon />}
            onClick={handleClick}
          >
            Add order
          </Button>
        }
      </GridToolbarContainer>
    );
  }

  const fetchTrade = async () => {
    return await tradesClient.get(accountName, tradeId);
  };

  useEffect(() => {
    const createTradeDto = TradeStore.FindTradeById(tradeId);
    const trade = {
      tradeId: createTradeDto.tradeId,
      quote: {
        symbol: createTradeDto.symbol,
        secType: createTradeDto.secType,
        strike: createTradeDto.strike,
        expirationDate: createTradeDto.expirationDate,
        right: createTradeDto.right,      
      }      
    } as unknown as TradeViewModel;
    setTrade(trade);    
    console.log("trade", trade);
    getPrices();
    getOrders();

    if(!createTradeDto) {
      // fetching trade from server
      // (async () => {
      //   try {
      //     const tradeModel = await fetchTrade();
      //     if (tradeModel) {
      //       setTrade(tradeModel);
      //     }
      //   } catch (error) {
      //     console.log("error", error);
      //     setError(error);
      //   }
      // })();
    }
    
  }, [tradeId]);

  const fetchContractPrice = async () => {
    return await quotesClient.quote(accountName, trade.quote.secType, trade.quote.symbol, trade.quote.strike, trade.quote.right, trade.quote.expirationDate, undefined);
  };

  const fetchOrders = async () => {
    return await ordersClient.get(accountName, tradeId);
  };

  const priceSuccessCb = (data) => {
    console.log("data", data);
    setQuote(data as QuoteResult);
  };

  const priceFailureCb = () => {
    console.log("interval failure");
  };

  const ordersSuccessCb = (orderModels: OrderViewModel[]) => {
    console.log("ordersSuccessCb", orderModels);
    const resultRows = [];
    orderModels && orderModels?.map((order: OrderViewModel) => {
      resultRows.push({
        id: order.orderId,
        executionType: order.executionType,
        actionType: order.action,
        amount: order.size,
        price: order.price,
        date: new Date(Date.parse(order.timeStop)),
        status: order.orderStatus,
        filledPercentage: order.filledQuantityPercentage,
        adaptivePriority: order.adaptivePriority,
      } as unknown as IOrderRow);
    });

    setRows(resultRows);
  };

  const orderFailureCb = () => {
    console.log("interval failure");
  };

  const { mutate: getPrices, isFetching: isFetchingPrices } = useInterval("pollQuotePrice", fetchContractPrice, priceSuccessCb, priceFailureCb);

  const { mutate: getOrders, isFetching: isFetchingOrders, setStop: enableOrderFecthing } = useInterval("pollOrders", fetchOrders, ordersSuccessCb, orderFailureCb);

  // useEffect(
  //   () =>
  //     autorun(() => {
  //       console.log('Running autoran', tradeId);        
  //     }),
  //   []
  // );

  const isRowValid = (row: GridEditRowProps) => {
    if (hidePrice) {
      return row.actionType.value !== null && row.actionType.value !== undefined &&
        row.executionType.value !== null && row.executionType.value !== undefined &&
        row.date.value !== null && row.date.value !== undefined && row.date.value > new Date();
    } else {
      console.log(row.executionType.value);
      return row.actionType.value !== null && row.actionType.value !== undefined &&
        row.executionType.value !== null && row.executionType.value !== undefined &&
        (row.executionType.value === 'MKT' || (row.price.value !== null && row.price.value !== undefined && +row.price.value > 0));
    }
  };

  const marks = useMemo(() => {
    return [
      {
        value: 25,
        label: '25',
      },
      {
        value: 50,
        label: '50',
      },
      {
        value: 75,
        label: '75',
      },
      {
        value: 100,
        label: '100',
      },
    ];
  }, []);

  function AmountEditInputCell(props: GridRenderCellParams<number>) {
    const { id, value, api, field } = props;

    const handleChange = (event: Event, newValue: number | number[]) => {
      api.setEditCellValue({ id, field, value: newValue }, event);
    };

    return (
      <div style={{ width: '70%' }}>
        <Slider
          value={value}
          valueLabelDisplay="on"
          step={25}
          marks={marks}
          min={25}
          max={100}
          onChange={handleChange}
        />
      </div>
    );
  }

  function renderAmount(params: GridRenderCellParams<number>) {
    return (
      <div style={{ width: '70%', paddingTop: '15px' }}>
        <Slider
          value={params.value}
          valueLabelDisplay="on"
          step={25}
          marks={marks}
          min={25}
          max={100}
          name="amount"
          disabled={true}
        />
      </div>
    );
  }

  function renderAmountEditInputCell(params) {
    return <AmountEditInputCell {...params} />;
  }

  const columns: GridColumns = [
    { field: 'id', hide: true },
    {
      field: 'orderType',
      headerName: 'Order Action Type',
      type: 'singleSelect',
      editable: true,
      valueOptions: Object.values(OrderType),
      align: "center",
      headerAlign: "center"
    },
    {
      field: 'actionType',
      headerName: 'Action',
      type: 'singleSelect',
      editable: true,
      valueOptions: ['BUY', 'SELL'],
      align: "left",
      headerAlign: "left"
    },
    {
      field: 'executionType',
      headerName: 'Order Exec Type',
      width: 180,
      type: 'singleSelect',
      editable: true,
      valueOptions: ['MKT', 'LMT', 'MIDPRICE', 'STP'],
      align: "left",
      headerAlign: "left"
    },
    {
      field: 'amount',
      headerName: 'Amount',
      renderCell: renderAmount,
      renderEditCell: renderAmountEditInputCell,
      editable: true,
      width: 300,
      type: 'number',
      align: "center",
      headerAlign: "left"
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      align: "left",
      headerAlign: "left"
    },
    {
      field: 'date',
      headerName: 'Time Stop',
      type: 'date',
      width: 200,
      align: "left",
      headerAlign: "left"
    },
    {
      field: 'adaptivePriority',
      headerName: 'Priority',
      type: 'singleSelect',
      editable: true,
      valueOptions: ['urgent', 'normal', 'patient'],
      //hide: trade.quote.isOption,
      align: "left",
      headerAlign: "left"
    },
    {
      field: 'status',
      headerName: 'Status',
      type: 'text',
      editable: false,
      align: "left",
      headerAlign: "left"
    },
    {
      field: 'filledPercentage',
      headerName: 'Filled%',
      type: 'number',
      editable: false,
      align: "left",
      headerAlign: "left"
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = apiRef.current.getRowMode(id) === 'edit';

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key='1'
              icon={<SaveIcon />}
              label='Save'
              onClick={handleSaveClick(id)}
              color='primary'
            />,
            <GridActionsCellItem
              key='2'
              icon={<CancelIcon />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key='3'
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
          />,
          <GridActionsCellItem
            key='4'
            icon={<DeleteIcon />}
            label='Delete'
            onClick={handleDeleteClick(id)}
            color='inherit'
          />,
        ];
      },
    },
  ];

  const returnInitialModalState = () => {
    setIsOpen(false);
  };

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<GridEvents.rowEditStop> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleCellFocusOut: GridEventListener<GridEvents.cellFocusOut> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => (event) => {    
    event.stopPropagation();
    apiRef.current.setRowMode(id, 'edit');
  };

  const handleSaveClick = (id) => async (event) => {
    event.stopPropagation();

    if (!isRowValid(apiRef.current.getEditRowsModel()[id])) {
      setError('Invalid input.');
      return;
    } else {
      console.log('valid');
      setError(undefined);
    }

    //TODO: post request to server and then commit to datragrid
    apiRef.current.commitRowChange(id);
    apiRef.current.setRowMode(id, 'view');
    const row = apiRef.current.getRow(id) as IOrderRow;


    const order = {
      tradeId: trade.tradeId,
      size: row.size,
      timeInForce: row.timeInForce,
      executionType: row.executionType,
      orderType: row.orderType,
      quote: trade.quote,
    } as unknown as CreateOrderPostModel;


    //const result = await ordersClient.post(accountName, order as Order);
    apiRef.current.updateRows([{ ...row, isNew: false }]);

    if (row.executionType === 'MKT') {
      row.price = undefined;
    }

    console.log("order to add / edit => ", row);

    enableOrderFecthing(true);
    handleCancelClick(id);
  };

  const handleDeleteClick = (id) => (event) => {
    event.stopPropagation();

    const row = apiRef.current.getRow(id);

    console.log("order to delete => ", row);
    //post reuqest to server and update store / grid accordingly    
    apiRef.current.updateRows([{ id, _action: 'delete' }]);
    setError(undefined);
  };

  const handleCancelClick = (id) => async (event) => {
    event.stopPropagation();

    apiRef.current.setRowMode(id, 'view');

    const row = apiRef.current.getRow(id);
    if (row!.isNew) {
      const result = await ordersClient.delete(accountName, id);
      apiRef.current.updateRows([{ id, _action: 'delete' }]);
    }

    setError(undefined);
    enableOrderFecthing(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      minimize={() => setIsOpen(false)}
      handleClose={returnInitialModalState}
      title={title}
      fullScreen={true}
    >
      <Box
        sx={{
          height: 500,
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <div
          style={{
            marginBottom: "10px"
          }}
        />
        <SelectDropdown
          label='Order type'
          data={Object.values(OrderType)}
          initialSelection={orderType}
          setData={setOrderType}
        />
        {quote && <TableContainer>
          <Table aria-label="simple table">
            <TableRow>
              <TableCell align="left">Ticker: {quote?.symbol}</TableCell>
              <TableCell align="left">Bid: {quote?.bid}</TableCell>
              <TableCell align="left">Ask: {quote?.ask}</TableCell>
              <TableCell align="left">Volume: {quote?.volume}</TableCell>
              {/* {trade.quote.isOption ?? <TableCell align="right">Underlying Price: {quote?.undPrice}</TableCell>} */}
            </TableRow>
          </Table>
        </TableContainer>}

        <div
          style={{
            marginBottom: "10px"
          }}></div>
        {error !== undefined && (
          <Alert severity="error" style={{ marginTop: 8 }}>
            {error}
          </Alert>
        )}
        <DataGridPro
          rows={rows}
          columns={columns}
          apiRef={apiRef}
          editMode='row'
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          onCellFocusOut={handleCellFocusOut}
          components={{
            Toolbar: EditToolbar,
          }}
          componentsProps={{
            toolbar: { apiRef },
          }}
          disableSelectionOnClick
        />
      </Box>
    </Modal>
  );
};

export default observer(OrderModal);
