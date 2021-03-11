import React from 'react';
import {
  useParams,
  useLocation,
} from 'react-router-dom';
import {
  Typography,
  Button,
  makeStyles,
  Container,
  CssBaseline,
} from '@material-ui/core';
import { LoginContext } from '../components/LoginContext';
import EndGameButton from '../components/EndGameButton';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

function QuestionNumber(info) {
  return (
    <Typography component="h1" variant="h5">
      {`Question: ${info.questionNum}/${info.totalQuestions}`}
    </Typography>
  );
}

function TimeRemaining(timer) {
  return (
    <Typography component="h1" variant="h5">
      {`Time Left: ${timer.timer}`}
    </Typography>
  );
}

function AdvanceGameButton(info) {
  async function advanceGame() {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${info.token}`,
        quizid: info.quizID,
      },
    };
    try {
      const response = await fetch(`${info.backendURL}/admin/quiz/${info.quizID}/advance`, options);
      const payload = await response.json();
      if (response.status !== 400) {
        info.setStage(() => response.stage);
      } else {
        throw new Error(payload.error);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => advanceGame()}
      disabled={info.timer !== 0}
    >
      Next question
    </Button>
  );
}

function HostGameScreen() {
  const [timer, setTimer] = React.useState(30);
  const [stage, setStage] = React.useState(0);
  const [questionNum, setQuestionNum] = React.useState(0);
  const [totalQuestions, setTotalQuestions] = React.useState(0);
  const [quizID, setQuizID] = React.useState('');

  const context = React.useContext(LoginContext);
  const { getToken, backendURL } = context;
  const token = getToken();
  const params = useParams();
  const { sessionID } = params;

  const location = useLocation();
  // Change time left text every second until there is no time left
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((time) => time - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  React.useEffect(() => {
    (async function getCurrStatus() {
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          sessionid: sessionID,
        },
      };
      try {
        const response = await fetch(`${backendURL}/admin/session/${sessionID}/status`, options);
        if (response.status !== 400) {
          const payload = await response.json();
          console.log(payload);
          // Set initial countdown time
          const currTime = new Date();
          const expiryTime = new Date(payload.results.isoTimeLastQuestionStarted);
          expiryTime.setSeconds(expiryTime.getSeconds()
          + payload.results.questions[payload.results.position].time);
          console.log(currTime, expiryTime, ((expiryTime - currTime) / 1000));
          let timeLeft = Math.ceil((expiryTime - currTime) / 1000);
          if (timeLeft < 0) timeLeft = 0;
          setTimer(() => timeLeft);
          // Set question number
          setQuestionNum(() => payload.results.position + 1);
          // Total number of questions
          console.log(payload.results.questions.length);
          setTotalQuestions(() => payload.results.questions.length);
          setQuizID(() => location.state.quizID);
        }
      } catch (err) {
        console.log(err);
      }
    }());
  }, [stage, backendURL, sessionID, token, location]);

  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <QuestionNumber questionNum={questionNum} totalQuestions={totalQuestions} />
        <TimeRemaining timer={timer} />
        {(questionNum !== totalQuestions)
          && (
          <AdvanceGameButton
            backendURL={backendURL}
            quizID={quizID}
            token={token}
            setStage={setStage}
            timer={timer}
          />
          )}
        <EndGameButton
          quizID={quizID}
          sessionID={sessionID}
        />
      </div>
    </Container>
  );
}

export default HostGameScreen;
