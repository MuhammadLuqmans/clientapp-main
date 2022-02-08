import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HubConnection } from '@microsoft/signalr';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { observer } from 'mobx-react';
import { connect } from '../../hub/trading-hub';
import { useInterval } from '../../hooks/use-interval';
import { useStores } from '../../hooks/use-stores';

const useStyles = makeStyles({
  root: {
    padding: 10,
    display: 'flex',
  },
  connected: {
    marginRight: 2,
    color: '#4caf50',
  },
  disconnected: {
    marginRight: 2,
    color: '#d9182e',
  },
});

const CustomFooterStatusComponent = () => {
  const classes = useStyles();
  const [TWSStatus, setTWSStatus] = useState<string>("");
  const [CPStatus, setCPStatus] = useState<string>("");
  const [connection, setConnection] = useState<HubConnection>(null);
  const { WatchlistStore } = useStores();
  const { accountName } = useParams<any>();

  useEffect(() => {
    (async () => {
      const hubConnection = await connect(accountName);
      setConnection(hubConnection);
      mutateTWSStatus();      
    })();
  }, [accountName]);

  const pollIbkrStatus = async () => {
    connection.invoke("TWSStatus", accountName).then((res) => {
      setTWSStatus(res ? 'connected' : 'disconnected');
    }).catch((error) => console.log('error polling account status', error));

    //todo figure out how to pass CP account
    connection.invoke("CPStatus", "zeke7757").then((res) => {
      setCPStatus(res ? 'connected' : 'disconnected');
    }).catch((error) => console.log('error polling account status', error));
  };  

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const { mutate: mutateTWSStatus } = useInterval("pollIbkrStatus", pollIbkrStatus, () => { }, () => { });    

  return (
    <div style={{ display: 'flex' }}>
      <div className={classes.root} style={{ display: 'flex', justifyContent: "space-between" }}>
        <div style={{ display: 'flex' }}>
          <FiberManualRecordIcon fontSize="small" className={classes[TWSStatus]} />
          {TWSStatus}
        </div>
      </div>
      <div className={classes.root} style={{ display: 'flex', justifyContent: "space-between" }}>
        <div style={{ display: 'flex' }}>
          <FiberManualRecordIcon fontSize="small" className={classes[CPStatus]} />
          {CPStatus}
        </div>
      </div>
    </div>
  );
};

export default observer(CustomFooterStatusComponent);