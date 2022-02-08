import { makeStyles } from "@material-ui/core";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import * as React from "react";
import { useForm } from 'react-hook-form';
import useNotifications from "../../hooks/useNotifications";
import AuthService from "../../services/auth-service";
import { getAccountsClient } from "../../services/ibwatchdog-api.service";
import { CreateAccountPostModel, ICreateAccountPostModel, TradingMode } from "../../swagger-clients/ibwatchdog-api-clients.service";

interface IAddAccountModalProps {
    onAccountCreated(): void;
    onHide(): void;
}

interface IAccount {
    name: string;
    password: string;
    tradingMode: TradingMode;
}

const myStyles = makeStyles((theme)=>({
    Popup_form_add_account:{
        // background:"#181b3f",
        // color:"#fff",
        // outline:"#fff"
    }   
}));

const AddAccountModal: React.FC<IAddAccountModalProps> = (props) => {
    const myClasses = myStyles();
    const { register, handleSubmit, formState: { errors } } = useForm<IAccount>();
    const [requestInProgress, setRequestInProgress] = React.useState<boolean>(false);
    const { setSuccessNotification, setErrorNotification, processServerError } = useNotifications();
    const onSubmit = async (data: IAccount) => {
        try {
            const { currentUser } = AuthService;

            const access_token = currentUser?.token;
            if (access_token) {
                setRequestInProgress(true);
                const client = getAccountsClient(access_token);
                await client.createAccount(
                    new CreateAccountPostModel({
                        username: data.name,
                        password: data.password,
                        tradingMode: data.tradingMode
                    } as ICreateAccountPostModel));
                setSuccessNotification("Account added successfully.");
                props.onAccountCreated();
            }

        } catch (error) {
            processServerError(error, "An error occurred while adding account.");
        } finally {
            setRequestInProgress(false);
        }
    };

    return <Dialog open={true}  fullWidth={true} maxWidth="sm" onClose={props.onHide}>
        <form onSubmit={handleSubmit(onSubmit)} className={myClasses.Popup_form_add_account}>
            <DialogTitle>Add Account</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} marginTop={2}>
                    <Grid item xs={12}>
                        <TextField variant="outlined"
                            label={"Name"}
                            fullWidth
                            inputProps={{ ...register("name", { required: true }), disabled: requestInProgress }}
                            error={errors.name?.type === 'required'}
                        />
                        {errors.name?.type === 'required' && <small style={{ color: "red", marginLeft: "5px" }} >Account name is required.</small>}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField variant="outlined"
                            label="Password"
                            fullWidth
                            inputProps={{ ...register("password", { required: true }), disabled: requestInProgress, type: "password" }}
                            error={errors.password?.type === 'required'} />
                        {errors.password?.type === 'required' && <small style={{ color: "red", marginLeft: "5px" }} >Password is required.</small>}
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Trading mode</InputLabel>
                            <Select
                                label="Trading mode"
                                inputProps={{ ...register("tradingMode", { required: true }), disabled: requestInProgress }} >
                                <MenuItem value={"Paper"}>Paper</MenuItem>
                                <MenuItem value={"Live"}>Live</MenuItem>
                            </Select>
                        </FormControl>
                        {errors.tradingMode?.type === 'required' && <small style={{ color: "red", marginLeft: "5px" }} >Trading mode is required.</small>}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" type="submit">Save changes</Button>
                <Button variant="outlined" color="secondary" onClick={props.onHide}>Cancel</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default AddAccountModal;
