import { Container, Divider } from '@material-ui/core';
import { GridCellParams, GridColDef } from '@material-ui/data-grid';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import Button from '../../common/Button';
import ContainerLabel from '../../common/ContainerLabel';
import DataGridTable from '../../common/DataGridTable';
import CreateOrderModal from '../../components/CreateOrderModal';
import Layout from '../../components/Layout';
import { getOpenTrades } from '../../services/trades';

const TraderPortal = () => {
  const { data } = useQuery('openTrades', getOpenTrades);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [initialModalState, setInitialModalState] = useState<any>();

  useEffect(() => {
    if (initialModalState) setIsModalOpen(true);
  }, [initialModalState]);

  const rows = useMemo(
    () =>
      data &&
      data.map((instrument) => ({
        id: instrument.id,
        symbol: instrument.symbol,
        type: '1.2',
        thesis: instrument.thesis,
        tactic: 'S',
        stockUnderlying: `${instrument.stockUnderlying}`,
      })),
    [data]
  );

  const renderOptionButtons = (params: GridCellParams) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <div>{params.value}</div>
      <div
        style={{
          display: 'flex',
        }}
      >
        <Button
          small
          style={{ marginRight: 10, color: 'white' }}
          onClick={() => {
            //TODO: fetch order data from the backend and set is as initial state
            setInitialModalState({ orders: [{ name: params.row.symbol }] });
          }}
        >
          Edit
        </Button>
        <Button small buttonType='dangerButton' style={{ color: 'white' }}>
          Close
        </Button>
      </div>
    </div>
  );

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'id', headerName: 'Trade ID', width: 150 },
      {
        field: 'symbol',
        headerName: 'Symbol',
        width: 150,
      },
      {
        field: 'type',
        headerName: 'Type',
        width: 150,
      },
      {
        field: 'thesis',
        headerName: 'Thesis',
        width: 150,
      },
      {
        field: 'tactic',
        headerName: 'Tactic: S or O',
        width: 170,
      },
      {
        field: 'stockUnderlying',
        headerName: 'E = Stock Underlying',
        width: 320,
        renderCell: renderOptionButtons,
      },
    ],
    []
  );
  return (
    <>
      <Layout />
      <Container>
        <ContainerLabel label='Trader Portal' size='large' />
        <Button onClick={() => setIsModalOpen(true)}>Create Order</Button>
        <CreateOrderModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          initialState={initialModalState}
        />
        <Divider style={{ marginTop: 15, opacity: 0 }} />
        {!data?.length ? null : <DataGridTable rows={rows} columns={columns} />}
      </Container>
    </>
  );
};

export default TraderPortal;
