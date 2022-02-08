import { Button, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation } from 'react-query';
import AutocompleteInput from '../../common/AutocompleteInput';
import Checkbox from '../../common/Checkbox';
import ContainerLabel from '../../common/ContainerLabel';
import InstrumentTab from '../../common/InstrumentTab';
import SelectDropdown from '../../common/SelectDropdown';

//TODO: change any after recieving real data fron the backend
interface IProps {
  data: any[];
  orders: any[];
  setOrders: (value: any) => void;
  strategies: any[];
  setStrategies: (value: any) => void;
  isMultiLeg: boolean;
  setIsMultiLeg: (value: any) => void;
  removeTabHandler: ({
    data,
    setData,
    label,
  }: {
    data: any[];
    setData: (value: any) => void;
    label: string;
  }) => void;
}

const StockOrderType: React.FC<IProps> = ({
  data,
  orders,
  setOrders,
  strategies,
  setStrategies,
  isMultiLeg,
  setIsMultiLeg,
  removeTabHandler,
}) => {
  const [isStrategy, setIsStrategy] = useState(false);

  return (
    <>
      <AutocompleteInput
        multiple
        label='Search instruments'
        data={data}
        selectedData={isStrategy ? strategies : orders}
        onSelect={isStrategy ? setStrategies : setOrders}
        setFilterQuery={() => ({})}
        onFilterData={() => ({})}
      />
      <div style={{ display: 'flex' }}>
        <Checkbox
          label='Strategy'
          checked={isStrategy}
          onChange={() => setIsStrategy((prev) => !prev)}
          disabled={!orders?.length}
        />
        <Checkbox
          label='Multi-leg'
          checked={isMultiLeg}
          onChange={() => setIsMultiLeg((prev: boolean) => !prev)}
        />
      </div>
      {orders?.length > 0 && (
        <>
          <ContainerLabel label='Orders:' />
          {orders.map((instrument: any) => (
            <InstrumentTab
              label={instrument.name}
              key={instrument.name}
              removeInstrument={() =>
                removeTabHandler({
                  data: orders,
                  setData: setOrders,
                  label: instrument.name,
                })
              }
            >              
              <SelectDropdown data={['size', 'size2']} />
              <SelectDropdown data={['tif', 'tif2']} />
            </InstrumentTab>
          ))}
        </>
      )}
      {strategies?.length > 0 && (
        <>
          <ContainerLabel label='Strategies:' />
          {strategies.map((instrument: any) => (
            <InstrumentTab
              label={instrument.name}
              key={instrument.name}
              removeInstrument={() =>
                removeTabHandler({
                  data: strategies,
                  setData: setStrategies,
                  label: instrument.name,
                })
              }
            >
              <SelectDropdown data={['tp', 'tp2']} />
              <SelectDropdown data={['sl', 'sl2']} />
            </InstrumentTab>
          ))}
        </>
      )}
    </>
  );
};

export default StockOrderType;
