import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import * as React from "react";
import { useForm } from 'react-hook-form';
import useNotifications from "../../hooks/useNotifications";
import AuthService from "../../services/auth-service";
import { getAccountsClient } from "../../services/ibwatchdog-api.service";
import { CreateAccountPostModel, ICreateAccountPostModel, TradingMode } from "../../swagger-clients/ibwatchdog-api-clients.service";

interface IAddTDAAccountModalProps {
    onAccountCreated(): void;
    onHide(): void;
}

interface IAccount {
    name: string;   
    tradingMode: TradingMode;
}

const AddTDAAccountModal: React.FC<IAddTDAAccountModalProps> = (props) => {

    const { register, handleSubmit, formState: { errors } } = useForm<IAccount>();
    const [requestInProgress, setRequestInProgress] = React.useState<boolean>(false);
    const { setSuccessNotification, setErrorNotification, processServerError } = useNotifications();
    const onSubmit = async (data: IAccount) => {
        try {

            window.location.href = `${process.env.REACT_APP_BACKEND_API_ENDPOINT}/api/tdaoauth/redirect-to-tda?name=${encodeURI(data.name)}&tradingMode=${data.tradingMode}`;
     

        } catch (error) {
            processServerError(error, "An error occurred while adding account.");
        } finally {
            setRequestInProgress(false);
        }


    };

    return <Dialog open={true} fullWidth={true} maxWidth="sm" onClose={props.onHide}>
         <form onSubmit={handleSubmit(onSubmit)}>
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
                        {errors.name?.type === 'required' && <small style={{color:"red", marginLeft:"5px"}} >Account name is required.</small>}
                    </Grid>   
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Trading mode</InputLabel>
                            <Select
                                label="Trading mode"
                                inputProps={{ ...register("tradingMode",{required:true}), disabled: requestInProgress }} >
                                <MenuItem value={"Paper"}>Paper</MenuItem>
                                <MenuItem value={"Live"}>Live</MenuItem>
                            </Select>
                        </FormControl>
                        {errors.tradingMode?.type === 'required' && <small style={{color:"red", marginLeft:"5px"}} >Trading mode is required.</small>}
                    </Grid>                                       
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" type="submit">Connect TDA Account</Button>
                <Button variant="outlined" color="secondary" onClick={props.onHide}>Cancel</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default AddTDAAccountModal;
