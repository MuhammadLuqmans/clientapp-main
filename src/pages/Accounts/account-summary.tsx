import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    PnlResponseModel,
} from '../../swagger-clients/ibwatchdog-api-clients.service';

import { AuthService } from '../../services/auth-service';
import { getAccountsClient } from '../../services/ibwatchdog-api.service';

interface IAccountPnlProps {
    accountName: string;
}

const AccountPnl: React.FC<IAccountPnlProps> = ({ accountName }) => {
    const [accountPnl, setAccountPnl] = useState<PnlResponseModel>(null);

    useEffect(() => {
        const access_token = AuthService.currentUser?.token;
        const client = getAccountsClient(access_token);

        const interval = setInterval(async () => {
            const accountsResult = await client.accountPnl(accountName);
            setAccountPnl(accountsResult);
        }, 60000);

        return () => {
            clearInterval(interval);
        };
    }, [accountName]);

    return accountPnl &&
        <TableContainer sx={{ minWidth: 650 }}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="right" sx={{borderBottomWidth: 0}}>Account</TableCell>
                        <TableCell align="right" sx={{borderBottomWidth: 0}}>Daily</TableCell>
                        <TableCell align="right" sx={{borderBottomWidth: 0}}>Realized</TableCell>
                        <TableCell align="right" sx={{borderBottomWidth: 0}}>Unrealized</TableCell>
                        <TableCell align="right" sx={{borderBottomWidth: 0}}>Balance</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell align="right">{accountPnl.account}</TableCell>
                        <TableCell align="right">{accountPnl?.dailyPnL}</TableCell>
                        <TableCell align="right">{accountPnl?.realizedPnL}</TableCell>
                        <TableCell align="right">{accountPnl?.unrealizedPnL}</TableCell>
                        <TableCell align="right">{accountPnl?.totalCashValue}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>;
};

export default AccountPnl;