import { useState } from "react";
import { useMutation, useQuery} from "react-query";
import useNotifications from "./useNotifications";

export function useInterval(queryKey, queryFn, onSuccess, onError) {
    const [enabled, setEnabled] = useState(false);
    const { processServerError } = useNotifications();

    // Mutation to start the process
    const { mutate } = useMutation(queryFn, {
        onMutate: () => {            
            console.log("mutate..");    
            setEnabled(false);            
            setEnabled(true);
        },
        onError: error => {
            console.error("test1 "+ error);
            //setEnabled(false);
            onError();
        },
        onSuccess: (data) => {
            console.log(data);
        },
    });

    //Fetch until received status is finished
    const { isLoading, data, isFetching } = useQuery(queryKey, queryFn, {
        onSuccess: (data: any) => {
            onSuccess(data);
        },
        onError: error => {
            console.log('An error occurred while getting accounts.', error);
            processServerError(error, 'An error occurred while getting accounts.');
            console.error("test" + error);
            //setEnabled(false);

            onError();
        },
        enabled: enabled,
        keepPreviousData: true,
        refetchInterval: 6000,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
    });

    return { mutate, data, isLoading, isFetching, setStop: setEnabled };
}