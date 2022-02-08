/* eslint-disable react/display-name */
import { Container } from '@material-ui/core';
import { useState } from 'react';
import { useParams } from 'react-router';
import { observer } from 'mobx-react';
import SelectDropdown from '../../common/SelectDropdown';
import { OrderOptions } from '../../components/CreateOrderModal/CreateOrderModal.style';
import Layout from '../../components/Layout';
import OptionSelection from '../../components/OptionSelection';
import { SecurityType } from '../../utilities/contract.utilities';
import DefaultSelection from '../../components/DefaultSelection';
import AccountPnl from '../Accounts/account-summary';
import CreateTrade from '../../components/Trade/Trade';

const Home = ((props) => {
  const [symbolSecType, setSymbolSecType] = useState<SecurityType>(SecurityType.STK);
  const { accountName } = useParams<any>();

  const renderSelection = (secType: SecurityType) => {
    switch (secType) {
      case SecurityType.FUT:
      case SecurityType.STK:
      case SecurityType.IND:

        return (
          <div style={{ marginBottom: 30 }}>
            <DefaultSelection
              account={accountName}
              securityType={symbolSecType}
            />
          </div>
        );
      case SecurityType.OPT:
      case SecurityType.FOP:
        return (
          <div style={{ marginBottom: 30 }}>
            <OptionSelection
              account={accountName}
              securityType={symbolSecType}
            />
          </div>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Layout />
      <Container>
        <OrderOptions>
          <SelectDropdown
            label='Security type'
            initialSelection={symbolSecType}
            data={Object.values(SecurityType)}
            setData={setSymbolSecType}
          />
          <AccountPnl accountName={accountName} />
        </OrderOptions>
        {renderSelection(symbolSecType)}
        <CreateTrade />
      </Container>
    </>
  );
});

export default observer(Home);
