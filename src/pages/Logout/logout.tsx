import * as React from 'react';
import AuthService from '../../services/auth-service';

const Logout = (props) => {
  React.useEffect(() => {
    AuthService.logout();
  }, []);  
  return <></>;
};

export default Logout;
