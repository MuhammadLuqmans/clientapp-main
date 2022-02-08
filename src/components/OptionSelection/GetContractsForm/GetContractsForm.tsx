import { Button, InputLabel, MenuItem } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import { useState } from 'react';
import * as Yup from 'yup';
import LoadingIndicator from '../../LoadingIndicator';

// Test data:
// Account: zeke7757
// Symbol: TSLA
// SecType: OPT (dropdown)
// Expiration Date: 20210924
// Strikes: 600,700,800,
// Right: C

const ValidationSchema = Yup.object().shape({
  // secType: Yup.string().required('Required'),
  expirationDate: Yup.array().min(1, 'Required'),
  strikes: Yup.array().min(1, 'Required'),
  right: Yup.string().required('Required'),
});

interface IProps {
  //TODO: add types
  setData: any;
  searchOptions: any;
}

//TODO this is unused atm
const GetContractsForm: React.FC<IProps> = ({ setData, searchOptions }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          // secType: '',
          expirationDate: [],
          strikes: [],
          right: '',
        }}
        validationSchema={ValidationSchema}
        onSubmit={async (inputValues, { setSubmitting }) => {
          setSubmitting(false);

          try {
            setIsLoading(true);            
          } catch (error) {
            console.log(error);
            setIsLoading(false);
          }
        }}
      >
        {({ values, setFieldValue, handleChange, errors, touched }) => (
          <Form
            style={{
              display: 'flex',
              flexDirection: 'column',
              // width: 300,
              margin: '0 auto',
              gap: 20,
            }}
          >
            {/* not necessary */}
            {/* <InputLabel htmlFor='secType' style={{ margin: 0, fontSize: 12 }}>
            Sec Type
          </InputLabel>
          <Field component={TextField} type='text' name='secType' select={true}>
            <MenuItem value='OPT'>OPT</MenuItem>
          </Field> */}

            {/* <InputLabel
            htmlFor='expirationDate'
            style={{ margin: 0, fontSize: 12 }}
          >
            Expiration Date
          </InputLabel> */}
            {/* <Field
            component={TextField}
            type='text'
            name='expirationDate'
            select={true}
            value={values?.expirationDate}
            onChange={(e: any) =>
              setFieldValue('expirationDate', e.target.value)
            }
            SelectProps={{
              multiple: true,
            }}
          >
            {searchOptions?.expirations.map((expDate: any, key: number) => (
              <MenuItem key={key} value={expDate}>
                {expDate}
              </MenuItem>
            ))}
          </Field> */}
            <InputLabel htmlFor='strikes' style={{ margin: 0, fontSize: 12 }}>
              Strikes
            </InputLabel>
            <Field
              component={TextField}
              type='text'
              name='strikes'
              select={true}
              value={values.strikes}
              SelectProps={{
                multiple: true,
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Field>
            <InputLabel htmlFor='right' style={{ margin: 0, fontSize: 12 }}>
              Right
            </InputLabel>
            <Field
              component={Select}
              type='text'
              name='right'
              id='right'
              value={values.right}
              onChange={handleChange}
              error={touched.right && Boolean(errors.right)}
            >
              <MenuItem value='P'>P</MenuItem>
              <MenuItem value='C'>C</MenuItem>
            </Field>
            <Button type='submit'>Send</Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default GetContractsForm;
