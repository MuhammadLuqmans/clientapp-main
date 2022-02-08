import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateFilterContainer } from './DatePickerInput.style';

interface IProps {
  label: string;
  setDate: any;
  defaultSelection: Date;
}

const DatePickerInput: React.FC<IProps> = ({ label, setDate, defaultSelection }) => {
  const [innerDate, setInnerDate] = useState(new Date());

  useEffect(() => {    
    setInnerDate(defaultSelection);
  }, [defaultSelection]);

  return (
    <DateFilterContainer>
      <b>{label}</b>
      <DatePicker
        selected={innerDate}        
        onChange={(date: Date) => {
          setInnerDate(date);
          setDate(date.toLocaleDateString('zh-Hans-CN').split('/').join(''));
        }}
        minDate={new Date()}
        highlightDates={[]}
      />
    </DateFilterContainer>
  );
};

export default DatePickerInput;
