import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import AutocompleteInput from '../../common/AutocompleteInput';
import Checkbox from '../../common/Checkbox';
import ContainerLabel from '../../common/ContainerLabel';
import InstrumentTab from '../../common/InstrumentTab';
import SelectDropdown from '../../common/SelectDropdown';

//TODO: change any after recieving real data fron the backend
interface IProps {
  instrumentsData: any[];
  optionsData: any[];
  orders: any[];
  setOrders: (value: any) => void;
  instrument: any[];
  setInstrument: (value: any) => void;
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

const OptionOrderType: React.FC<IProps> = ({
  instrumentsData,
  optionsData,
  orders,
  setOrders,
  instrument,
  setInstrument,
  isMultiLeg,
  setIsMultiLeg,
  removeTabHandler,
}) => {
  return (
    <>
      <AutocompleteInput
        label='Search instruments'
        data={instrumentsData}
        selectedData={instrument}
        onSelect={setInstrument}
        setFilterQuery={() => ({})}
        onFilterData={() => ({})}
      />
      {instrument && Object.keys(instrument)?.length > 0 && (
        <AutocompleteInput
          multiple
          label='Search options'
          data={optionsData}
          selectedData={orders}
          onSelect={setOrders}
          setFilterQuery={() => ({})}
          onFilterData={() => ({})}
        />
      )}
      <div style={{ display: 'flex' }}>
        <Checkbox
          label='Multi-leg'
          checked={isMultiLeg}
          onChange={() => setIsMultiLeg((prev: boolean) => !prev)}
        />
      </div>
      {orders?.length > 0 && (
        <>
          <ContainerLabel label='Orders:' />
          {orders.map((option: any) => (
            <InstrumentTab
              label={option.name}
              key={option.name}
              removeInstrument={() =>
                removeTabHandler({
                  data: orders,
                  setData: setOrders,
                  label: option.name,
                })
              }
            >
              <SelectDropdown data={['size', 'size2']} />
              <SelectDropdown data={['tif', 'tif2']} />
            </InstrumentTab>
          ))}
        </>
      )}
    </>
  );
};

export default OptionOrderType;
