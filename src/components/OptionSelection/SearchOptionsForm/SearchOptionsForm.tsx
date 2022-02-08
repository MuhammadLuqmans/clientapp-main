import { Button } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import LoadingIndicator from '../../../components/LoadingIndicator';


// Test data:
// Account: zeke7757
// Symbol: TSLA
// ConId: 76792991
// SecType: STK (dropdown)
// Exchange: SMART

const ValidationSchema = Yup.object().shape({
  symbol: Yup.string().required('Required'),
  conId: Yup.number().required('Required'),
  // secType: Yup.string().required('Required'),
});

interface IProps {
  //TODO: add types
  setData: any;
  side: 'CALL' | 'PUT';
  expirationDate: any;
  isLoadingNewPage: boolean;
}

//todo this is unused atm
const SearchOptionsForm: React.FC<IProps> = ({
  setData,
  side,
  expirationDate,
  isLoadingNewPage: isLoadingAutoComplete
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {(isLoading || isLoadingAutoComplete) && <LoadingIndicator />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          symbol: '',
        }}
        validationSchema={ValidationSchema}
        onSubmit={async (inputValues, { setSubmitting }) => {
          setSubmitting(false);

          try {
            setIsLoading(true);            
            const { symbol } = inputValues;
            // const { account, conId, symbol, secType } = inputValues;
            const exchange = 'SMART';

            //nakon odabira optiona, ide request
            // promijeniti request u novi request
            // client              
            //   .searchOptions('amela133', 'STK', symbol, exchange)
            //   .then((result: any) => {
            //     setData(result.result);
            //     setIsLoading(false);
            //   })
            //   .catch((error) => console.log(error));
          } catch (error) {
            console.log(error);
            setIsLoading(false);
          }
        }}
      >
        {() => (
          <Form
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: '0 auto',
              gap: 20,
            }}
          >
            {/* <Field
              component={TextField}
              name='symbol'
              label='Symbol'
              id='symbol'
              InputLabelProps={{
                shrink: true,
              }}
            /> */}
            <Button type='submit'>Send</Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SearchOptionsForm;
