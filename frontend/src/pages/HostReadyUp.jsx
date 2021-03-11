import React from 'react';
import { Button, Container, Typography } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { LoginContext } from '../components/LoginContext';
import styles from '../css/HostReadyUp.module.css';
import EndGameButton from '../components/EndGameButton';

function HostReadyUp() {
  const quizID = parseInt(useParams().quizID, 10);
  const sessionID = parseInt(useParams().sessionID, 10);
  const { backendURL } = React.useContext(LoginContext);
  const [players, setPlayers] = React.useState([]);
  const [error, setError] = React.useState('');
  const history = useHistory();

  // game starts if user readys up
  async function startPlayerQuiz() {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        quizid: quizID,
      },
    };
    // attempt fetch
    try {
      const response = await fetch(`${backendURL}/admin/quiz/${quizID}/advance`, options);
      const payload = await response.json();
      if (response.status === 400) {
        throw new Error(payload.error);
      } else {
        history.push({
          pathname: `/hostScreen/${sessionID}`,
          state: {
            quizID,
          },
        });
      }
      // catch error
    } catch (err) {
      setError(err.message);
    }
  }

  // every 5 seconds, check to see if new players have entered
  React.useEffect(() => {
    const interval = setInterval(() => {
      (async function getPlayers() {
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${window.localStorage.getItem('token')}`,
            sessionid: sessionID,
          },
        };
        // attempt fetch
        try {
          const response = await fetch(`${backendURL}/admin/session/${sessionID}/status`, options);
          const payload = await response.json();
          if (response.status === 400) {
            throw new Error(payload.error);
          }
          // user is redirected to ready screen
          setPlayers(() => [...payload.results.players]);

          // catch error
        } catch (err) {
          setError(err.message);
        }
      }());
    }, 1000);
    return () => clearInterval(interval);
  }, [backendURL, sessionID, players]);

  return (
    <Container component="main" maxWidth="xs">
      <div className={styles.ready_container}>
        <Typography component="h1" variant="h4">
          Session ID:
          {sessionID}
        </Typography>
        <Typography component="h1" variant="h5">
          Waiting for players to join...
        </Typography>
        <div className={styles.ready_player_container}>
          <Button disabled={!(players.length > 0)} variant="contained" color="primary" onClick={() => startPlayerQuiz()}>Ready</Button>
          <EndGameButton
            quizID={quizID}
            sessionID={sessionID}
          />
          <div className={styles.players_container}>
            <Typography component="h1" variant="h5">
              Players so far:
            </Typography>
            {players.map((p) => <div key={p}>{p}</div>)}
          </div>
          {error}
        </div>
        <Typography color="error">
          {error}
        </Typography>
      </div>
    </Container>
  );
}

export default HostReadyUp;
