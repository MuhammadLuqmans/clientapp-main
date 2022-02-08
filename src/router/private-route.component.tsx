import { Redirect, Route } from "react-router";
import * as React from "react";
import  AuthService  from "../services/auth-service";

interface IPrivateRoute{
    component:any;
    roles: string[]
}
const PrivateRoute = ({ component: Component, roles,path, ...rest }: { component: any, path:string, exact?:any, roles?: string[] }) => {

const isloggedIn = AuthService.isLoggedIn();
console.log("Is logged in ",isloggedIn);
    
    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            isloggedIn ?
                <Component {...props} />
                : <Redirect to="/login" />
        )} />
    );
};

export default PrivateRoute;
