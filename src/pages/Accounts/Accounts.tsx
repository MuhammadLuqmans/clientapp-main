/* eslint-disable react/display-name */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid, GridCellParams, GridColDef } from '@material-ui/data-grid';
import { Button, Container, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Lock,
  LockOpen,
  AddBoxOutlined,
  PlayArrow,
  Stop,
  DeleteOutline,
  Edit,
  Close,
  AddOutlined,
} from '@material-ui/icons';
import AuthService from '../../services/auth-service';
import {
  getAccountsClient,
  getContainersManagementClient,
} from '../../services/ibwatchdog-api.service';
import {
  AccountsQuery,
  AccountStatus,
  AccountType,
  IListResultOfAccountsViewModel,
  TradingMode,
  VMContainerStatus,
} from '../../swagger-clients/ibwatchdog-api-clients.service';

import useNotifications from '../../hooks/useNotifications';
import EditAccountModal from './edit-account-modal';
import AddAccountModal from './add-account-modal';
import Layout from '../../components/Layout';
import AddTDAAccountModal from './add-tda-account.modal';
import { useInterval } from '../../hooks/use-interval';

interface IAccountTableRow {
  id: string;
  username: string;
  tradingMode: TradingMode;
  accountType: AccountType;
  locked: boolean;
  lockedByUserId?: string;
  lockedByUsername?: string;
  accountStatus: AccountStatus;
  containerStatus: string;
  connectionStatus: string;
}

const myStyles = makeStyles((theme) => ({
  DataGrid_styles: {
    background: '#020d29',
    color: '#fff',
    border: 'none',
    fontSize: '15px',
    fontFamily: 'Roboto',
    textTransform: 'capitalize',
    rowHeight:"10px",
    
  },
  main_container: {
    backgroundColor: '#181b3f',
    height: '100vh',
  },
  buttons_wrapper: {
    display: 'flex',
    justifyContent: 'end',
  },
  Buttons_popup: {
    color: '#fff',
    border: '1px solid #fff',
    marginLeft: '15px',
    marginBottom: '15px',
  },
  accound_Model: {
    background: '#000',
  },
}));

const Accounts = () => {
  const myClasses = myStyles();
  const theme = useTheme();
  const [rows, setRows] = useState<IAccountTableRow[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showEditAccountModal, setShowEditAccountModal] =
    useState<boolean>(false);
  const [showAddAccountModal, setShowAddAccountModal] =
    useState<boolean>(false);
  const [showAddTDAAccountModal, setShowAddTDAAccountModal] =
    useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<string>(undefined);

  const {
    setNotification,
    setErrorNotification,
    setSuccessNotification,
    processServerError,
  } = useNotifications();
  const urlDecode = function (str) {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  };

  const successFn = (accountsResponse) => {
    if (accountsResponse && accountsResponse.items.length > 0) {
      const resultRows = accountsResponse.items.map(
        (account) =>
          ({
            id: account.id,
            username: account.username,
            tradingMode: account.tradingMode,
            locked: account.isLocked,
            lockedByUserId: account.lockedByUserId,
            lockedByUsername: account.lockedByUsername,
            accountStatus: account.status,
            accountType: account.accountType,
            containerStatus: getContainerStatusString(account.containerStatus),
            connectionStatus: account.gatewayConnected
              ? 'connected'
              : 'disconnected',
          } as IAccountTableRow)
      );

      setRows(resultRows);
      setTotalRecords(accountsResponse.totalRecords);
    }
  };

  const failureFn = () => {
    console.log('interval failure');
  };

  useEffect(() => {
    const urlHash = document.location.hash;
    if (urlHash && urlHash.length > 0) {
      const splitHash = urlHash.split('=');
      if (splitHash.length == 2) {
        console.log('splitHash', splitHash);
        if (splitHash[0] == '#successMessage') {
          setSuccessNotification(urlDecode(splitHash[1]));
        } else if (splitHash[0] == '#errorMessage') {
          setErrorNotification(urlDecode(splitHash[1]));
        }
        document.location.hash = '';
      }
    }
  }, []);

  const classes = makeStyles({
    rootOverrides: {
       height:"80vh",
      '& button': {
        color: theme.palette.info.light,
      },
      '& .MuiDataGrid-cell': {
        outline: 'none !important',
        boxShadow: 'none',
        fontWeight: '100 !important',
        fontFamaily: 'Roboto',
        fontSize: '12.5px',
      },
      '& .MuiDataGrid-columnHeaderTitleContainer': {
        textTransform: 'uppercase',
      },
      '& svg': {
        fill: 'green',
      },
      '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
        outline: 'none',
      },
      '&.MuiDataGrid-root *': {
        color: '#fff',
        fontWeight: '100 !important',
      },
      '& .MuiTablePagination-actions:before':{
        content:'hello',
        color:'#fff',
      },
    },
  })();

  const getAccounts = async (): Promise<IListResultOfAccountsViewModel> => {
    const access_token = AuthService.currentUser?.token;
    if (access_token) {
      const skip = currentPage * recordsPerPage;
      const client = getAccountsClient(access_token);
      const accountsResult = await client.getAccounts({
        skip: skip,
        take: recordsPerPage,
      } as AccountsQuery);

      return accountsResult;
    }
  };

  const {
    mutate,
    data: accountsResponse,
    isLoading,
    isFetching,
  } = useInterval('pollAccounts', getAccounts, successFn, failureFn);

  useEffect(() => {
    mutate();
  }, [currentPage]);

  const onLockAccountClick = async (username: string) => {
    try {
      const access_token = AuthService.currentUser?.token;
      if (access_token) {
        const client = getAccountsClient(access_token);
        await client.lockAccount(username ?? '');
        getAccounts();
      }
    } catch (error) {
      console.log('An error occurred while trying to lock account.', error);
      processServerError(
        error,
        'An error occurred while trying to lock account.'
      );
    }
  };

  const onCreateContainerClick = async (username: string) => {
    try {
      const access_token = AuthService.currentUser?.token;

      if (access_token) {
        const client = getContainersManagementClient(access_token);
        await client.createContainer(username);
        getAccounts();
      }
    } catch (error) {
      console.log('An error occurred while trying to create container.', error);
      processServerError(
        error,
        'An error occurred while trying to create container.'
      );
    }
  };

  const onStartContainerClick = async (username: string) => {
    try {
      const access_token = AuthService.currentUser?.token;
      if (access_token) {
        const client = getContainersManagementClient(access_token);
        await client.startContainer(username);
        getAccounts();
      }
    } catch (error) {
      console.log('An error occurred while trying to start container.', error);
      processServerError(
        error,
        'An error occurred while trying to start container.'
      );
    }
  };

  const onStopContainerClick = async (username: string) => {
    try {
      const access_token = AuthService.currentUser?.token;
      if (access_token) {
        const client = getContainersManagementClient(access_token);
        await client.stopContainer(username);
        getAccounts();
      }
    } catch (error) {
      console.log('An error occurred while trying to stop container.', error);
      processServerError(
        error,
        'An error occurred while trying to stop container.'
      );
    }
  };

  const onDeleteContainerClick = async (username: string) => {
    try {
      const access_token = AuthService.currentUser?.token;
      if (access_token) {
        const client = getContainersManagementClient(access_token);
        await client.deleteContainer(username);
        getAccounts();
      }
    } catch (error) {
      processServerError(error, 'An error occurred while deleting container.');
    }
  };

  const onEditAccountUsersClick = (accountName?: string) => {
    setSelectedAccount(accountName);
    setShowEditAccountModal(true);
  };

  const onDeleteAccountClick = async (accountName?: string) => {
    const confirmBox = window.confirm(
      'Do you really want to delete this Account?'
    );
    if (confirmBox === true) {
      try {
        const access_token = AuthService.currentUser?.token;
        if (access_token) {
          const client = getAccountsClient(access_token);

          await client.deleteAccount(accountName!);
          setSuccessNotification('Account successfully deleted.');
          getAccounts();
        }
      } catch (error) {
        processServerError(error, 'An error occurred while deleting account.');
      }
    }
  };

  const getUsernameDataColumn = (account: IAccountTableRow): JSX.Element => {
    const userId = AuthService.currentUser?.userId;
    if (userId) {
      return (
        <Link to={`/accounts/${account.username}/trader-portal`}>
          {account.username}
        </Link>
      );
    }

    return <>{account.username}</>;
  };

  const columns: GridColDef[] = [
    {
      field: 'username',
      headerName: 'Username',
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: GridCellParams) => {
        return getUsernameDataColumn(row as IAccountTableRow);
      },
    },
    {
      field: 'accountType',
      headerName: 'Account type',
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: any) => {
        const isTDA = params.row.accountType == 'tda';
        return isTDA ? 'TDA' : 'IB';
      },
    },
    {
      field: 'tradingMode',
      headerName: 'Trading mode',
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'locked',
      headerName: ' ',
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: any) => {
        return (
          <>
            {params.row.locked && (
              <Button title={`Locked by: ${params.row.lockedByUsername}`}>
                <Lock />
              </Button>
            )}
            {!params.row.locked && (
              <Button
                onClick={async () =>
                  await onLockAccountClick(params.row.username)
                }
              >
                <LockOpen />
              </Button>
            )}
          </>
        );
      },
    },
    {
      field: 'accountStatus',
      headerName: 'Account status',
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'containerStatus',
      headerName: 'Container status',
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: any) => {
        const isTDA = params.row.accountType == 'tda';
        if (isTDA == params.row.containerStatus) {
          return <p>---</p>;
        } else {
          return !isTDA ? params.row.containerStatus : '';
        }
      },
    },
    {
      field: 'connectionStatus',
      headerName: 'Connection Status',
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'actions',
      headerName: ' ',
      width: 250,
      sortable: false,
      disableColumnMenu: true,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: any) => {
        const isTDA = params.row.accountType == 'tda';
        const admin = AuthService.currentUser?.isAdmin;
        const account = params.row as IAccountTableRow;
        return (
          admin && (
            <>
              {!isTDA && !account.containerStatus && (
                <Button
                  onClick={() => onCreateContainerClick(account.username)}
                >
                  <AddBoxOutlined fontSize='small' />
                </Button>
              )}
              {!isTDA &&
                account.containerStatus?.toLowerCase() ==
                  VMContainerStatus.Terminated.toLowerCase() && (
                  <Button
                    onClick={() => onStartContainerClick(account.username)}
                  >
                    <PlayArrow fontSize='small' />
                  </Button>
                )}
              {!isTDA &&
                account.containerStatus?.toLowerCase() ==
                  VMContainerStatus.Running.toLowerCase() && (
                  <Button
                    onClick={() => onStopContainerClick(account.username)}
                  >
                    <Stop fontSize='small' />
                  </Button>
                )}

              {!isTDA && account.containerStatus && (
                <Button
                  onClick={() => onDeleteContainerClick(account.username)}
                >
                  <DeleteOutline fontSize='small' />
                </Button>
              )}
              <Button onClick={() => onEditAccountUsersClick(account.username)}>
                <Edit fontSize='small' />
              </Button>
              <Button onClick={() => onDeleteAccountClick(account.username)}>
                <Close fontSize='small' style={{ fill: 'red' }} />
              </Button>
            </>
          )
        );
      },
    },
  ];

  return (
    <>
      <div className={myClasses.main_container}>
        <Layout />
        <Container>
          <div className={myClasses.buttons_wrapper}>
            <Button
              variant='outlined'
              className={myClasses.Buttons_popup}
              onClick={() => setShowAddAccountModal(true)}
              startIcon={<AddOutlined htmlColor='#fff' />}
            >
              Add IB Account
            </Button>
            <Button
              variant='outlined'
              className={myClasses.Buttons_popup}
              onClick={() => setShowAddTDAAccountModal(true)}
              startIcon={<AddOutlined htmlColor='#fff' />}
            >
              Add TDA Account
            </Button>
          </div>
          <DataGrid
            className={myClasses.DataGrid_styles}
            isRowSelectable={() => false}
            autoHeight
            columns={columns}
            rows={rows}
            rowHeight={40}
            pagination
            page={currentPage}
            pageSize={recordsPerPage}
            onPageChange={(page: number) => {
              console.log('Current page', page);
              setCurrentPage(page);
            }}
            onPageSizeChange={(pagesize: number) => setRecordsPerPage(pagesize)}
            rowsPerPageOptions={[10, 25, 50]}
            rowCount={totalRecords}
            paginationMode='server'
            loading={isLoading}
            classes={{
              root: classes.rootOverrides,
            }}
          />

          {showEditAccountModal && (
            <EditAccountModal
              accountName={selectedAccount}
              onHide={() => {
                setSelectedAccount(undefined);
                setShowEditAccountModal(false);
              }}
            />
          )}

          {showAddAccountModal && (
            <AddAccountModal
              onAccountCreated={() => {
                setShowAddAccountModal(false);
                getAccounts();
              }}
              onHide={() => {
                setShowAddAccountModal(false);
              }}
            />
          )}

          {showAddTDAAccountModal && (
            <AddTDAAccountModal
              onAccountCreated={() => {
                setShowAddTDAAccountModal(false);
                getAccounts();
              }}
              onHide={() => {
                setShowAddTDAAccountModal(false);
              }}
            />
          )}
        </Container>
      </div>
    </>
  );
};

const getContainerStatusString = (containerStatus?: VMContainerStatus) => {
  switch (containerStatus?.toLowerCase()) {
    case VMContainerStatus.Provisioning.toLowerCase():
      return 'Provisioning';
    case VMContainerStatus.Repairing.toLowerCase():
      return 'Repairing';
    case VMContainerStatus.Running.toLowerCase():
      return 'Running';
    case VMContainerStatus.Staging.toLowerCase():
      return 'Staging';
    case VMContainerStatus.Stopping.toLowerCase():
      return 'Stopping';
    case VMContainerStatus.Suspended.toLowerCase():
      return 'Suspended';
    case VMContainerStatus.Suspending.toLowerCase():
      return 'Suspending';
    case VMContainerStatus.Terminated.toLowerCase():
      return 'Terminated';
    case VMContainerStatus.Unknown.toLowerCase():
      return 'Unknown';
    default:
      return '';
  }
};

export default Accounts;
