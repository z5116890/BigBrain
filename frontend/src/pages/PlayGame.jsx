import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import { useParams, Link } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { LoginContext } from '../components/LoginContext';
import AnswerButton from '../components/AnswerButton';
import CorrectAnswer from '../components/CorrectAnswer';
import MediaShow from '../components/MediaShow';
import styles from '../css/PlayGame.module.css';

function PlayGame() {
  const [ready, setReady] = React.useState(false);
  const [gameEnded, setGameEnded] = React.useState(false);
  const [currQuestion, setCurrQuestion] = React.useState(null);
  const playerID = parseInt(useParams().playerID, 10);
  const { backendURL } = React.useContext(LoginContext);
  const [timer, setTimer] = React.useState(30);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [clickedAnswers, setClickedAnswers] = React.useState([]);
  const [correctAnswers, setCorrectAnswers] = React.useState([]);
  const [submittedAnswers, setSubmittedAnswers] = React.useState([]);
  const matches = useMediaQuery('(max-width:600px)');

  // submit users answers
  function submitAnswers() {
    // set submittedAnswers which will be shown after question timer finishes
    setSubmittedAnswers(() => {
      const answers = [];
      for (let i = 0; i < clickedAnswers.length; i += 1) {
        if (clickedAnswers[i] === true) {
          answers.push(i);
        }
      }
      return answers;
    });
  }
  // complete submit when submitted answers is updated
  React.useEffect(() => {
    if (submittedAnswers.length > 0) {
      (async function completeSubmit() {
        const options = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            playerid: playerID,
          },
          body: JSON.stringify({
            answerIds: submittedAnswers,
          }),
        };
        try {
          const response = await fetch(`${backendURL}/play/${playerID}/answer`, options);
          const payload = await response.json();
          if (response.status === 400) {
            throw new Error(payload.error);
          } else {
            setMessage(() => 'Submitted Answer. You can submit again until timer runs out.');
          }
        } catch (err) {
          setMessage(err.message);
        }
      }());
    }
  }, [submittedAnswers, backendURL, playerID]);

  // handles the event of user clicking answer button
  function answerClick(index) {
    if (currQuestion.type === 'Single Choice') {
      setClickedAnswers((answers) => {
        const curr = [];
        for (let i = 0; i < answers.length; i += 1) {
          curr.push(false);
        }
        curr[index] = true;
        return curr;
      });
    } else if (currQuestion.type === 'Multi Choice') {
      setClickedAnswers((answers) => {
        const curr = [...answers];
        if (curr[index] === false) {
          curr[index] = true;
        } else {
          curr[index] = false;
        }
        return curr;
      });
    }
  }

  // check to see if host has started or ended quiz
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (gameEnded === false) {
        (async function checkReady() {
          const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              playerid: playerID,
            },
          };
          try {
            const response = await fetch(`${backendURL}/play/${playerID}/status`, options);
            if (response.status !== 400) {
              const payload = await response.json();
              setReady(() => payload.started);
            } else {
              setReady(() => false);
              setGameEnded(() => true);
            }
          } catch (err) {
            setMessage(err.message);
          }
        }());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [backendURL, playerID, ready, gameEnded]);

  // when game is ready, get curr Question
  React.useEffect(() => {
    if (ready === true) {
      (async function getCurrQuestion() {
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            playerid: playerID,
          },
        };
        try {
          const response = await fetch(`${backendURL}/play/${playerID}/question`, options);
          if (response.status !== 400) {
            const payload = await response.json();
            setCurrQuestion(() => payload.question);
            setClickedAnswers(() => {
              const answers = [];
              payload.question.answers.forEach(() => answers.push(false));
              return answers;
            });
            const currTime = new Date();
            const expiryTime = new Date(payload.question.isoTimeLastQuestionStarted);
            expiryTime.setSeconds(expiryTime.getSeconds() + payload.question.time);
            setTimer(() => Math.ceil((expiryTime - currTime) / 1000));
          }
        } catch (err) {
          setMessage(err.message);
        }
      }());
    }
  }, [ready, backendURL, playerID]);

  // poll to see if curr question has changed by host.
  // (only after the previous question's answer is being shown)
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (ready === true && showAnswer === true) {
        (async function checkNewQuestion() {
          const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              playerid: playerID,
            },
          };
          try {
            const response = await fetch(`${backendURL}/play/${playerID}/question`, options);
            if (response.status !== 400) {
              const payload = await response.json();
              if (currQuestion.qno !== payload.question.qno) {
                setCurrQuestion(() => payload.question);
                setClickedAnswers(() => {
                  const answers = [];
                  payload.question.answers.forEach(() => answers.push(false));
                  return answers;
                });
                setShowAnswer(() => false);
                setSubmittedAnswers(() => []);
                const currTime = new Date();
                const expiryTime = new Date(payload.question.isoTimeLastQuestionStarted);
                expiryTime.setSeconds(expiryTime.getSeconds() + payload.question.time);
                setTimer(() => Math.ceil((expiryTime - currTime) / 1000));
              }
            }
          } catch (err) {
            setMessage(err.message);
          }
        }());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [backendURL, playerID, showAnswer, currQuestion, ready]);

  // update timer
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (showAnswer === false) {
        setTimer((time) => time - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [showAnswer]);

  // when timer reaches 0, set showAnswer to true
  React.useEffect(() => {
    if (ready === true && timer <= 0 && showAnswer === false) {
      (async function getCorrectAnswers() {
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            playerid: playerID,
          },
        };
        try {
          const response = await fetch(`${backendURL}/play/${playerID}/answer`, options);
          // if frontend timer is faster than backend timer, keep polling until response is success
          const payload = await response.json();
          if (response.status !== 400) {
            setCorrectAnswers(() => [...payload.answerIds]);
            setShowAnswer(() => true);
            setMessage(() => '');
          } else {
            throw new Error(payload.error);
          }
        } catch (err) {
          setMessage('Answer coming up.');
        }
      }());
    }
  }, [timer, backendURL, playerID, showAnswer, ready]);

  return (
    <Container component="main" maxWidth="md">
      {(ready === false && currQuestion === null && gameEnded === false) && (
        <div className={styles.play_container}>
          <Typography component="h1" variant="h5" className={styles.messageContainer}>
            Waiting for host to start game...
          </Typography>
        </div>
      )}
      {(ready === false && gameEnded === true) && (
        <div className={styles.play_container}>
          <Typography component="h1" variant="h5" className={styles.messageContainer}>
            Game has ended...
          </Typography>
          <Link to={`/results/${playerID}`}>
            <Button size="small" color="primary">
              View Results
            </Button>
          </Link>
        </div>
      )}
      {(ready === true && showAnswer === true
        && correctAnswers.length !== 0 && gameEnded === false) && (
        <div className={styles.play_container}>
          <Typography component="h1" variant="h5" className={styles.messageContainer}>
            Correct Answers:
          </Typography>
          {correctAnswers.map((i) => (
            <CorrectAnswer
              key={i}
              answer={currQuestion.answers[i].answer}
              correct={currQuestion.answers[i].correct}
            />
          ))}
          <Typography component="h1" variant="h5" className={styles.messageContainer}>
            You Answered:
          </Typography>
          {submittedAnswers.map((a) => (
            <CorrectAnswer
              key={a}
              answer={currQuestion.answers[a].answer}
              correct={currQuestion.answers[a].correct}
            />
          ))}
          {submittedAnswers.length === 0
          && (
            <Typography component="h1" variant="h5" className={styles.messageContainer}>
              Nothing
            </Typography>
          )}
          <Typography component="h1" variant="h5" className={styles.messageContainer}>
            Waiting for host...
          </Typography>
        </div>
      )}
      {(ready === true && showAnswer === false && currQuestion !== null && gameEnded === false) && (
        <div className={styles.play_container}>
          <Typography component="h1" variant="h5" className={styles.messageContainer}>
            {`Points: ${currQuestion.points}`}
          </Typography>
          <Typography component="h1" variant="h5" className={styles.messageContainer}>
            {`Time Left: ${timer}`}
          </Typography>
          <MediaShow videoURL={currQuestion.videoURL} photoURL={currQuestion.photoURL} />
          <Typography component="h1" variant="h5" className={styles.messageContainer}>
            {`${currQuestion.qno}: `}
            {currQuestion.question}
          </Typography>
          <div className={styles.answer_container}>
            <Grid container spacing={1}>
              {clickedAnswers.map(
                (a, index) => (
                  <Grid key={`answer-${currQuestion.answers[index].answer}`} item xs={matches ? 12 : 6}>
                    <AnswerButton
                      clicked={a}
                      answer={currQuestion.answers[index].answer}
                      index={index}
                      answerClick={answerClick}
                    />
                  </Grid>
                ),
              )}
              <Button variant="contained" className={styles.button} color="primary" onClick={() => submitAnswers()}>Submit</Button>
            </Grid>
          </div>
          <Typography component="h1" variant="h5" className={styles.messageContainer}>
            {message}
          </Typography>
          <Typography component="h1" variant="h5" className={styles.messageContainer}>
            {(currQuestion.type === 'Single Choice' ? 'Choose One Answer' : 'Choose Answer/s')}
          </Typography>
        </div>
      )}
    </Container>
  );
}

export default PlayGame;
