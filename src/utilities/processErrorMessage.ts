import { toast } from 'react-toastify';
import { ErrorResultModel } from '../swagger-clients/ibwatchdog-api-clients.service';

export const processErrorMessage = (error: any) => {
  const errorModel = error as ErrorResultModel;
  if (errorModel?.errors && errorModel.errors.length > 0) {
    toast.error(
      errorModel.errors?.reduce((prev, curr) => {
        return prev + '<br/>' + curr;
      }, '')
    );
  } else {
    toast.error('Unknown error occurred.');
  }
  console.log('An error occurred:', error);
};
