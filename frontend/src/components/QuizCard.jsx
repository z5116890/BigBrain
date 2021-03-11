import React from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  makeStyles,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import EditIcon from '@material-ui/icons/Edit';
import QuestionMarkIcon from '@material-ui/icons/HelpOutline';
import TimerIcon from '@material-ui/icons/Timer';
import copy from 'clipboard-copy';
import PropTypes from 'prop-types';
import {
  Link,
} from 'react-router-dom';
import SessionModal from './SessionModal';
import QuizResultsLinksModal from './QuizResultsLinksModal';
import { LoginContext } from './LoginContext';
import styles from '../css/dashboard.module.css';

const useStyles = makeStyles(() => ({
  container: {
    margin: '10px',
  },
  delete: {
    position: 'absolute',
    right: 0,
  },
  card: {
    position: 'relative',
    margin: '120px auto 50px',
    width: 310,
    overflow: 'visible',
  },
  editViewDeleteContainer: {
    position: 'inherit',
  },
  media: {
    height: 140,
  },
  icon: {
    position: 'relative',
    top: '5px',
  },
  imageContainer: {
    width: '100%',
    height: '140px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    display: 'none',
    marginBottom: '10%',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: '700',
    fontSize: 'large',
  },
}));
// quiz card are the different games that appear on users dashboard
function QuizCard(props) {
  const {
    quizName,
    quizThumbnail,
    quizID,
    quizSessionIDs,
    active,
    startGame,
    deleteQuiz,
    endGame,
    questions,
  } = props;
  const classes = useStyles();
  const [started, setStarted] = React.useState(active !== null);
  const [gameInProgress, setGameInProgress] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [sessionID, setSessionID] = React.useState(active === null ? null : active);
  // Get token
  const context = React.useContext(LoginContext);
  const { getToken, backendURL, localhostURL } = context;
  const token = getToken();
  const [photoURL, setPhotoURL] = React.useState(quizThumbnail);

  // if photoURL updated, save quiz
  React.useEffect(() => {
    // save quiz
    if (photoURL !== null) {
      (async function saveQuiz() {
        const options = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${window.localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            thumbnail: photoURL,
          }),
        };

        // attempt fetch
        try {
          const response = await fetch(`${backendURL}/admin/quiz/${quizID}`, options);
          const payload = await response.json();
          // check if email and pw combination exists
          if (response.status === 400) {
            throw new Error(payload.error);
          }
          // catch error
        } catch (err) {
          console.log(err);
        }
      }());
    }
  }, [photoURL, backendURL, quizID]);
  // check if game has started
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (started === true && gameInProgress === false) {
        (async function checkStarted() {
          const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              sessionid: sessionID,
            },
          };
          try {
            const response = await fetch(`${backendURL}/admin/session/${sessionID}/status`, options);
            const quizDetails = await response.json();
            if (response.status !== 200) {
              throw new Error(quizDetails.error);
            }
            const questionStarted = quizDetails.results.position;
            setGameInProgress(() => (questionStarted > -1));
          } catch (err) {
            console.log(err);
          }
        }());
      } else if (started === false) {
        setGameInProgress(() => false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [started, token, backendURL, sessionID, gameInProgress]);

  // if game started, get sessionID for player to copy the link
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (started === true && sessionID === null) {
        (async function getSessionID() {
          const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          };
          try {
            const response = await fetch(`${backendURL}/admin/quiz/${quizID}`, options);
            const quizDetails = await response.json();
            if (response.status !== 200) {
              throw new Error(quizDetails.error);
            }
            const session = quizDetails.active;
            setSessionID(() => session);
          } catch (err) {
            console.log(err);
          }
        }());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [started, sessionID, backendURL, quizID, token]);

  // handle photo upload
  function handleUpload(e) {
    e.stopPropagation();
    const [file] = e.target.files;
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const valid = validFileTypes.find((imgtype) => imgtype === file.type);
    // bad data, let's walk away
    if (!valid) {
      return false;
    }
    // if we get here we have a valid image
    const reader = new FileReader();

    reader.onload = (event) => {
      // do something with the data result
      const dataURL = event.target.result;
      setPhotoURL(() => dataURL);
    };
    reader.readAsDataURL(file);
    return true;
  }

  function QuizNumQuestions() {
    return (
      <div className={classes.info}>
        <QuestionMarkIcon />
        <Typography>{questions.length}</Typography>
      </div>
    );
  }

  function QuizTime() {
    const reducer = (totalTime, currentQuestion) => totalTime + currentQuestion.time;
    const total = questions.reduce(reducer, 0);
    return (
      <div className={classes.info}>
        <TimerIcon />
        <Typography>
          {total}
          s
        </Typography>
      </div>
    );
  }

  return (
    <Grid item xs={12} sm={4} md={3} className={classes.container}>
      <Card className={classes.card}>
        {photoURL !== null
          && (
            <CardMedia
              className={classes.media}
              image={photoURL}
              title={quizName}
            />
          )}
        {photoURL === null
          && (
            <div className={classes.imageContainer}>
              <label htmlFor="contained-button-file" className={classes.button}>
                <input
                  accept="image/*"
                  className={classes.input}
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={(e) => handleUpload(e)}
                />
                <Button variant="contained" color="primary" component="span">
                  <AddAPhotoIcon />
                </Button>
              </label>
            </div>
          )}
        <CardContent>
          <Typography gutterBottom component="h4">
            <Box fontWeight="fontWeightBold" display="inline" fontSize="h4.fontSize">
              {quizName}
            </Box>
          </Typography>
          <QuizNumQuestions />
          <QuizTime />
          {(!started)
          && (
            <Button
              size="small"
              color="primary"
              area-label="create session button"
              onClick={() => {
                startGame(quizID);
                setStarted((oldStarted) => !(oldStarted));
                setOpenModal((oldOpen) => !(oldOpen));
              }}
            >
              Create Session
            </Button>
          )}
          {(started)
          && (
            <div className={styles.quizSessionContainer}>
              <Typography gutterBottom component="h3">
                {`Active Session ID: ${sessionID === null ? active : sessionID}`}
              </Typography>
              <Button size="small" color="primary" onClick={() => copy(`${localhostURL}/joinGame/${sessionID === null ? active : sessionID}`)}>
                Copy Link
              </Button>
            </div>
          )}
          {(gameInProgress === false && started === true)
          && (
            <Link to={`/HostReadyUp/${quizID}/${sessionID}`}>
              <Button size="small" color="primary" area-label="start game button">
                Start Game
              </Button>
            </Link>
          )}
          {(started)
          && (
            <Button
              size="small"
              color="primary"
              onClick={() => {
                setStarted((oldStarted) => !(oldStarted));
                setOpenModal((oldOpen) => !(oldOpen));
                endGame(quizID);
              }}
            >
              Stop Game
            </Button>
          )}
        </CardContent>
        <CardActions className={classes.editViewDeleteContainer}>
          <div>
            <Link to={`/edit/${quizID}`}>
              <Button size="small" color="primary">
                <EditIcon />
              </Button>
            </Link>
            <Button className={classes.delete} size="small" color="primary" onClick={() => deleteQuiz(quizID)}>
              <DeleteIcon />
            </Button>
            <QuizResultsLinksModal quizSessionIDs={quizSessionIDs} />
          </div>
        </CardActions>
      </Card>
      {(openModal && started)
        && (
          <SessionModal
            open={openModal}
            setOpen={setOpenModal}
            sessionID={sessionID}
            title="Quiz is now Active!"
            message="Copy and paste link to join!"
            active
          />
        )}
      {(openModal && !(started))
        && (
          <SessionModal
            open={openModal}
            setOpen={setOpenModal}
            sessionID={sessionID}
            title="Session Ended"
            message="Would you like to view results?"
            active={false}
          />
        )}

    </Grid>
  );
}
QuizCard.defaultProps = {
  active: 0,
  quizThumbnail: null,
};
QuizCard.propTypes = {
  quizName: PropTypes.string.isRequired,
  quizThumbnail: PropTypes.string,
  quizID: PropTypes.number.isRequired,
  quizSessionIDs: PropTypes.arrayOf(PropTypes.number).isRequired,
  active: PropTypes.number,
  startGame: PropTypes.func.isRequired,
  deleteQuiz: PropTypes.func.isRequired,
  endGame: PropTypes.func.isRequired,
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default QuizCard;
