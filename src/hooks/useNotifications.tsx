/* eslint-disable @typescript-eslint/no-inferrable-types */

import { useSnackbar, VariantType } from 'notistack';
import { IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Fragment, useEffect, useState } from "react";
import { ErrorResultModel } from '../swagger-clients/ibwatchdog-api-clients.service';

export interface INotificationMessage {
    text?: string;
    variant?: VariantType;
}
const useNotifications = () => {
    const [notification, setNotification] = useState<INotificationMessage>({});
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const setErrorNotification = (message?: string) => {
        setNotification({ text: message, variant: 'error' } as INotificationMessage);
    };
    const setSuccessNotification = (message?: string) => {
        setNotification({ text: message, variant: 'success' } as INotificationMessage);
    };

    const processServerError = (error: any, defaultMessage: string = "Unknown error occurred.") => {
        const errorModel = error as ErrorResultModel;
        if (errorModel?.errors && errorModel.errors.length > 0) {
            errorModel.errors.forEach((message) => {
                setErrorNotification(message);
            });
        } else {
            setErrorNotification(defaultMessage);
        }
    };

    const action = key => (
        <Fragment>
            <IconButton onClick={() => { closeSnackbar(key); }}>
                <Close />
            </IconButton>
        </Fragment>
    );
    useEffect(() => {
        if (notification?.text) {
            let variant: VariantType = 'info';
            if (notification.variant) {
                variant = notification.variant;
            }
            enqueueSnackbar(notification.text, {
                variant: variant,
                autoHideDuration: 5000,
                action,
                anchorOrigin: { horizontal: "right", vertical: "top" }
            });
        }
    }, [notification]);
    return { setNotification, setErrorNotification, setSuccessNotification, processServerError };
};

export default useNotifications;