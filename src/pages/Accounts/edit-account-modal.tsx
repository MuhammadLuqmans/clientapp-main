import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from '@mui/material';
import {
  DataGridPro,
  GridColDef,
  GridRowData,
  GridRowsProp,
} from '@mui/x-data-grid-pro';
import * as React from 'react';
import { useState } from 'react';
import useNotifications from '../../hooks/useNotifications';
import AuthService from '../../services/auth-service';
import {
  getAccountsClient,
  getUsersClient,
} from '../../services/ibwatchdog-api.service';
import {  
  AccountsViewModel,  
  ApplicationUserViewModel,  
  AssignUsersPostModel,
  IAssignUsersPostModel,
} from '../../swagger-clients/ibwatchdog-api-clients.service';

interface IEditAccountModalProps {
  accountName: string;
  onHide(): void;
}

const EditAccountModal: React.FC<IEditAccountModalProps> = (props) => {
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [allUsers, setAllUsers] = React.useState<
    ApplicationUserViewModel[]
  >([]);
  const [account, setAccount] = React.useState<AccountsViewModel>(undefined);
  const [rows, setRows] = useState<GridRowData[]>([]);
  const { setErrorNotification, processServerError, setSuccessNotification } =
    useNotifications();

  React.useEffect(() => {
    getAccount();
    getAllUsers();
    setRows([
      { id: 1, col1: 'Hello', col2: 'World' },
      { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
      { id: 3, col1: 'MUI', col2: 'is Amazing' },
    ]);
  }, []);

  const getAccount = async () => {
    try {
      const access_token = AuthService.currentUser?.token;
      if (access_token) {
        setIsLoaded(false);
        const client = getAccountsClient(access_token);
        const account = await client.getAccount(props.accountName);
        setAccount(account);
      }
    } catch (error) {
      console.log('An error occurred while getting account.', error);
      processServerError(error, 'An error occurred while getting account.');
    } finally {
      setIsLoaded(true);
    }
  };

  const getAllUsers = async () => {
    try {
      const access_token = AuthService.currentUser?.token;
      if (access_token) {
        setIsLoaded(false);
        const client = getUsersClient(access_token);
        const users = await client.getUsers();
        setAllUsers(users);
      }
    } catch (error) {
      console.log('An error occurred while getting all users.', error);
      processServerError(error, 'An error occurred while getting all users.');
    } finally {
      setIsLoaded(true);
    }
  };

  const onUserSelectionChanged = (userId: string) => {
    if (account) {
      if (account.assignedUsers && account.assignedUsers.length > 0) {
        const userIndex = account.assignedUsers.findIndex((x) => x == userId);
        if (userIndex > -1) {
          account.assignedUsers = account.assignedUsers.filter(
            (x, i) => i !== userIndex
          );
        } else {
          account.assignedUsers = [...(account.assignedUsers ?? []), userId];
        }
      } else {
        account.assignedUsers = [userId];
      }
      setAccount(new AccountsViewModel({ ...account }));
    }
  };

  const updateAccount = async () => {
    try {
      const access_token = AuthService.currentUser?.token;
      if (access_token) {
        setIsLoaded(false);
        const client = getAccountsClient(access_token);

        await client.assignUsers(
          new AssignUsersPostModel({
            accountId: account?.id,
            assignedUsers: account?.assignedUsers,
          } as IAssignUsersPostModel)
        );
        setSuccessNotification('Successfully updated account users.');
      }
    } catch (error) {
      console.log('An error occurred while updating account users.', error);
      processServerError(
        error,
        'An error occurred while updating account users.'
      );
    } finally {
      setIsLoaded(true);
    }
  };

  const columns: GridColDef[] = [
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
    {
      field: 'col2',
      headerName: 'Column 2',
      width: 150,
      renderCell: (rows) => {
        return (
          <TextField id='outlined-basic' label='Outlined' variant='outlined' />
        );
      },
    },
  ];

  return (
    <Dialog open={true} fullWidth={true} maxWidth='lg' onClose={props.onHide}>
      <DialogTitle>Edit account users</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item md={1} sm={3}>
            Account
          </Grid>
          <Grid item md={11} sm={9}>
            {account ? account.username : ''}
          </Grid>

          <Grid item md={1} sm={3}>
            Status
          </Grid>
          <Grid item md={11} sm={9}>
            {account ? account.status : ''}
          </Grid>
          <Grid item md={1} sm={3}>
            Test
          </Grid>
          <Grid item md={11} sm={9}></Grid>
        </Grid>
        {isLoaded && (
          <>
            <h5>Assigned users</h5>
            <Grid container spacing={2}>
              {allUsers.map((user) => {
                const checked = account?.assignedUsers
                  ? account?.assignedUsers?.findIndex((x) => x == user.id) > -1
                  : false;
                return (
                  <Grid item sm={12} md={6} lg={4} key={user.id}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            color='primary'
                            checked={checked}
                            onChange={(e) => {
                              onUserSelectionChanged(user.id);
                            }}
                          />
                        }
                        label={user.displayName}
                      />
                    </FormGroup>
                  </Grid>
                );
              })}
            </Grid>
            <div style={{ height: 300, width: '100%' }}>
              <DataGridPro rows={rows} columns={columns} />
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='primary' onClick={updateAccount}>
          Save changes
        </Button>
        <Button variant='outlined' color='secondary' onClick={props.onHide}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAccountModal;
