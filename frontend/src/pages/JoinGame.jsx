import React from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
} from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { LoginContext } from '../components/LoginContext';
import styles from '../css/joinGame.module.css';

function JoinGame() {
  // error message to show on screen
  const [error, setError] = React.useState('');
  // current session id
  const [sessionID, setSessionID] = React.useState('');
  // current player name
  const [playerName, setPlayerName] = React.useState('');
  // get backend url
  const { backendURL } = React.useContext(LoginContext);
  const history = useHistory();
  const existingSession = parseInt(useParams().sessionID, 10);

  // handler for when user clicks join game
  async function joinHandler(e) {
    e.preventDefault();
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: playerName,
      }),
    };
    // attempt fetch
    try {
      const response = await fetch(`${backendURL}/play/join/${sessionID}`, options);
      const payload = await response.json();
      if (response.status === 400) {
        throw new Error(payload.error);
      }
      // user is redirected to ready screen
      history.push(`/play/${payload.playerId}`);

      // catch error
    } catch (err) {
      setError(err.message);
    }
  }
  // if player copys and pastes in link instead
  React.useEffect(() => {
    if (!(Number.isNaN(existingSession))) {
      setSessionID(() => existingSession);
    }
  }, [existingSession]);

  return (
    <Container component="main" maxWidth="xs">
      <div className={styles.join_container}>
        <Typography component="h1" variant="h5">
          Join Game
        </Typography>
        <form className={styles.join_form_container}>
          <TextField className={styles.join_text_container} margin="normal" required fullWidth autoFocus id="outlined-basic" label="Session ID" variant="outlined" value={sessionID} onChange={(e) => setSessionID(e.target.value)} />
          <TextField className={styles.join_text_container} margin="normal" required fullWidth autoFocus id="outlined-basic" label="Player Name" variant="outlined" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          <Button disabled={(sessionID === '' || playerName === '')} className={styles.join_button} variant="contained" color="primary" onClick={(e) => joinHandler(e)}>Join Game</Button>
        </form>
        <Typography color="error">
          {error}
        </Typography>
      </div>
    </Container>
  );
}

export default JoinGame;
