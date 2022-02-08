import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';


export const connect = async (account) => {
  const hubConnection = new HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_BACKEND_SOCKET_ENDPOINT}`) //{ accessTokenFactory: () => this.loginToken }
    .withAutomaticReconnect()
    .build();

  try {
    await hubConnection.start();
  } catch (err) {
    console.log(err);
  }

  if (hubConnection.state === HubConnectionState.Connected) {
    hubConnection
      .invoke("InvokeRegister", account)
      .catch((err: Error) => {
        return console.error(err.toString());
      });
  }

  return hubConnection;
};