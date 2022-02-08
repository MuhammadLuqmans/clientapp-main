import { useCallback, useEffect, useMemo, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useQueryClient } from 'react-query';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Modal from '../../common/Modal';
import SelectDropdown from '../../common/SelectDropdown';
import { useDidFirstRenderEffect } from '../../hooks';
import useNotifications from '../../hooks/useNotifications';
import { addTrade, OrderType } from '../../services/trades';
import { OrderOptions } from './CreateOrderModal.style';
import OptionOrderType from './OptionOrderType';
import StockOrderType from './StockOrderType';

interface IProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  initialState?: any; //TODO: change
}

//TODO: change name to OrderModal
const CreateOrderModal: React.FC<IProps> = ({
  isOpen,
  setIsOpen,
  initialState,
}) => {
  const [searchInstruments, setSearchInstruments] = useState('');
  const [orderType, setOrderType] = useState<OrderType>(OrderType.STOCK);
  const [instrument, setInstrument] = useState([]);
  const [orders, setOrders] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [isStrategy, setIsStrategy] = useState(false);
  const [isMultiLeg, setIsMultiLeg] = useState(false);
  const [thesis, setThesis] = useState('');
  const queryClient = useQueryClient();

  const { setErrorNotification, setSuccessNotification } = useNotifications();

  const mockedInstruments = useMemo(
    () => [{ name: 'Apple' }, { name: 'Microsoft' }, { name: 'Facebook' }],
    []
  );

  const mockedOptions = useMemo(
    () => [{ name: 'x' }, { name: 'y' }, { name: 'z' }],
    []
  );

  //setUpSignalRConnection("amela133");

  useDidFirstRenderEffect(() => {
    setOrders([]);
    setStrategies([]);
  }, [orderType]);

  useEffect(() => {
    if (initialState?.orders) {
      setOrders(initialState?.orders);
    }
  }, [initialState]);

  useEffect(() => {
    if (!orders?.length) {
      //remove strategies if there are no orders
      setIsStrategy(false);
      setStrategies([]);
    }
  }, [orders]);

  const returnInitialModalState = () => {
    setIsOpen(false);
    setIsStrategy(false);
    setIsMultiLeg(false);
    setOrderType(OrderType.STOCK);
    setOrders([]);
    setStrategies([]);
  };

  const removeTabHandler = useCallback(
    ({ data, setData, label }: { data: any; setData: any; label: string }) => {
      const left = data.filter((value: any) => value.name !== label);
      setData(left);
    },
    []
  );

  const createTradeHandler = async () => {
    try {
      const res = await addTrade({
        symbol: (orders[0] as any).name, //add only one order for testing
        tactic: 'S',
        thesis,
        stockUnderlying: '20',
      });
      queryClient.setQueryData(`openTrades`, res);
      setSuccessNotification('Order created');
      returnInitialModalState();
    } catch (error) {
      setErrorNotification('Display error from the backend');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      minimize={() => setIsOpen(false)}
      handleClose={returnInitialModalState}
      title='Create Trade'
      fullScreen={true}
    >
      <OrderOptions>
        <SelectDropdown label='Security type' data={['STK', 'STK2']} />
        <SelectDropdown
          label='Order type'
          data={Object.values(OrderType)}
          initialSelection={orderType}
          setData={setOrderType}
        />
        {orderType === OrderType.OPTION && (
          <>
            <SelectDropdown label='Side' data={['CALL', 'PUT']} />
            {/* <DatePickerInput label='Expiry date' /> */}
          </>
        )}
      </OrderOptions>
      <Input
        value={thesis}
        setValue={setThesis}
        label='Thesis'
        style={{ marginBottom: 20, width: '100%' }}
      />
      {orderType !== OrderType.OPTION ? (
        <StockOrderType
          data={mockedInstruments}
          orders={orders}
          setOrders={setOrders}
          strategies={strategies}
          setStrategies={setStrategies}
          isMultiLeg={isMultiLeg}
          setIsMultiLeg={setIsMultiLeg}
          removeTabHandler={removeTabHandler}
        />
      ) : (
        <OptionOrderType
          instrumentsData={mockedInstruments}
          optionsData={mockedOptions}
          instrument={instrument}
          setInstrument={setInstrument}
          orders={orders}
          setOrders={setOrders}
          isMultiLeg={isMultiLeg}
          setIsMultiLeg={setIsMultiLeg}
          removeTabHandler={removeTabHandler}
        />
      )}
      <Button
        alignment='flex-end'
        style={{ marginTop: '20px' }}
        onClick={createTradeHandler}
        disabled={!orders?.length || (isMultiLeg && orders?.length < 2)}
      >
        Create Trade
      </Button>
    </Modal>
  );
};

export default CreateOrderModal;
