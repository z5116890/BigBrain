import React from 'react';
import {
  Button,
  TextField,
  Typography,
  CssBaseline,
  Grid,
  Container,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import styles from '../css/login.module.css';
import { LoginContext } from '../components/LoginContext';

function Login() {
  const [em, setEmail] = React.useState('');
  const [pw, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const { finaliseLogin, backendURL } = React.useContext(LoginContext);
  const history = useHistory();

  // submit user email and password
  async function submitLogin(e) {
    e.preventDefault();
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: em,
        password: pw,
      }),
    };
    // attempt fetch
    try {
      const response = await fetch(`${backendURL}/admin/auth/login`, options);
      const payload = await response.json();
      // check if email and pw combination exists
      if (response.status === 400) {
        throw new Error(payload.error);
      }
      // store token in localStorage
      finaliseLogin(payload.token);
      // user is redirected to dashboard upon login
      history.push('/dashboard');

      // catch error
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={styles.login_container}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={styles.login_form_container} noValidate>
          <div>
            <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email" name="email" autoFocus value={em} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <TextField variant="outlined" margin="normal" required fullWidth type="password" id="password" label="Password" name="password" value={pw} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Typography color="error">
            {errorMessage}
          </Typography>
          <Button className={styles.login_button} variant="contained" color="primary" type="submit" onClick={(e) => submitLogin(e)}>Submit</Button>
          <Grid container>
            <Grid item>
              <Typography component={Link} to="/register">
                Don&apos;t have an account? Register
              </Typography>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default Login;
