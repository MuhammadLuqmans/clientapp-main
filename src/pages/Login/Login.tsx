import { useHistory } from "react-router-dom";
import { Button, Container, Grid, LinearProgress, TextField } from "@material-ui/core";
import Alert, { Color } from "@material-ui/lab/Alert";
import { useState } from "react";
import { useMutation } from "react-query";
import { postLoginData } from "../../services/api";
import Logo from "../../logo.png";
import AuthService from "../../services/auth-service";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    const history = useHistory();


    const { mutate, isLoading: postLoading } = useMutation(AuthService.login, {
        onSuccess: (data: any) => {
            console.log("onSuccess", data);
            setTimeout(() => {
                history.push("/");
            }, 1000);
            setMessage({
                text: "You are logged in, and you will be redirected in a few moments.",
                type: "success"
            });
        },
        onError: (data: any) => {
            setMessage({
                text: "Something went wrong with the request! Try again later.",
                type: "error"
            });
        }
    });

    const onSubmitHandler = (e: any) => {
        e.preventDefault();
        if (email && password) {
            const data = {
                email: email,
                password: password
            };
            mutate(data);
        } else {
            setMessage({
                text: "You have to enter username and password! They must not be empty!",
                type: "error"
            });
        }
    };
 
    return (
        <div className="c-login-page">
            <Container maxWidth="sm" className="c-login-page__wrap">
                <img src={Logo} alt="" className="c-login-page__logo" />
                <form className="c-login-page__form" noValidate autoComplete="off" onSubmit={onSubmitHandler}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            {message.text.length > 0 && <Alert severity={message.type as Color}>{message.text}</Alert>}
                            {postLoading && <LinearProgress />}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="username"
                                label="Username"
                                variant="outlined"
                                fullWidth
                                onChange={(e: any) => {
                                    setEmail(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="password"
                                label="Password"
                                variant="outlined"
                                type="password"
                                fullWidth
                                onChange={(e: any) => {
                                    setPassword(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} justifyContent="flex-end">
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Button type="submit" variant="contained" color="primary" disabled={postLoading} size="large" >Login</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </div>
    );
};

export default Login;
