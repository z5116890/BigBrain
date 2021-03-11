import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { LoginContext } from '../components/LoginContext';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Register() {
  const [nm, setName] = React.useState('');
  const [em, setEmail] = React.useState('');
  const [pw, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const { finaliseLogin, backendURL } = React.useContext(LoginContext);
  const history = useHistory();

  // submit user name, email and password
  async function submitRegister(e) {
    e.preventDefault();
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: em,
        password: pw,
        name: nm,
      }),
    };

    // attempt fetch
    try {
      const response = await fetch(`${backendURL}/admin/auth/register`, options);
      const payload = await response.json();
      // it does not seem to check for empty strings
      if (response.status === 400) {
        throw new Error(payload.error);
      }
      finaliseLogin(payload.token);
      // user is redirected to dashboard upon register
      history.push('/dashboard');
      // catch error
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoFocus
            value={nm}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            value={em}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={pw}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Typography color="error">
            {errorMessage}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(e) => submitRegister(e)}
          >
            Register
          </Button>
          <Grid container>
            <Grid item>
              <Typography component={Link} to="/login">
                Already have an account? Log in
              </Typography>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default Register;
