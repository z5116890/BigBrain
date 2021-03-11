import React from 'react';
import {
  Grid,
  // makeStyles,
} from '@material-ui/core';
import QuizCard from '../components/QuizCard';
import { LoginContext } from '../components/LoginContext';

// const useStyles = makeStyles(() => ({
//   root: {
//     flexGrow: 10,
//   },
// }));

let token;

// quiz object
function Quiz(id, name, thumbnail, activeSession, oldSessions, questions) {
  this.id = id;
  this.name = name;
  this.thumbnail = thumbnail;
  this.activeSession = activeSession;
  this.oldSessions = oldSessions;
  this.questions = questions;
}

function Dashboard() {
  // store quizID's
  const [quizIDs, setQuizIDs] = React.useState([]);
  // store all details of each quiz
  const [allQuizzes, setAllQuizzes] = React.useState([]);
  // const classes = useStyles();

  // Get token
  const context = React.useContext(LoginContext);
  const { getToken, backendURL } = context;
  token = getToken();

  // start game handler for when user presses start button on quizcard
  async function startGame(quizID) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        quizid: quizID,
      },
    };
    try {
      const response = await fetch(`${backendURL}/admin/quiz/${quizID}/start`, options);
      const payload = await response.json();
      if (response.status !== 200) {
        throw new Error(payload.error);
      }
      // catch error
    } catch (err) {
      console.log(err);
    }
  }

  // end game handler for when user presses stop button on quizcard
  async function endGame(quizID) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        quizid: quizID,
      },
    };
    try {
      const response = await fetch(`${backendURL}/admin/quiz/${quizID}/end`, options);
      const payload = await response.json();
      if (response.status !== 200) {
        throw new Error(payload.error);
      }
      // catch error
    } catch (err) {
      console.log(err);
    }
  }
  // if user clicks delete button, delete quiz
  async function deleteQuiz(quizID) {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        quizid: quizID,
      },
    };

    try {
      const response = await fetch(`${backendURL}/admin/quiz/${quizID}`, options);
      const payload = await response.json();
      if (response.status === 400) {
        throw new Error(payload.error);
      }
      // delete from allQuizzes
      setAllQuizzes((old) => {
        const curr = [...old];
        old.forEach((q, index) => {
          if (q.id === quizID) {
            curr.splice(index, 1);
          }
        });
        return curr;
      });
    } catch (err) {
      console.log(err);
    }
  }

  // get all quiz id's at first render
  React.useEffect(() => {
    // get all quiz ids made by user
    (async function getAllQuizIds() {
      setQuizIDs(() => []);
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      // attempt fetch
      try {
        const response = await fetch(`${backendURL}/admin/quiz/`, options);
        const payload = await response.json();
        if (response.status !== 200) {
          throw new Error(payload.error);
        }
        // get all the quiz ids
        // quizIds = payload.quizzes.map((quiz) => quiz.id);
        setQuizIDs(() => {
          const quizIds = [];
          payload.quizzes.forEach((q) => {
            quizIds.push(q.id);
          });
          return quizIds;
        });
        // catch error
      } catch (err) {
        console.log(err);
      }
    }());
  }, [backendURL]);

  // after quizID is updated, fetch each quiz's details and store in allQuizzes
  React.useEffect(() => {
    if (quizIDs.length !== 0) {
      quizIDs.forEach((id) => {
        // get quiz details of a quiz
        (async function getQuizDetails(quizID) {
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

            const quiz = new Quiz(
              quizID,
              quizDetails.name,
              quizDetails.thumbnail,
              quizDetails.active,
              quizDetails.oldSessions,
              quizDetails.questions,
            );
            setAllQuizzes((allQ) => [...allQ, quiz]);
          } catch (err) {
            console.log(err);
          }
        }(id));
      });
    }
  }, [quizIDs, backendURL]);

  return (
    <div>
      <Grid
        container
        spacing={10}
        direction="row"
        justify="space-around"
        alignItems="center"
      >
        {allQuizzes.length > 0 && allQuizzes.map((q) => <QuizCard key={q.id} quizID={q.id} quizName={q.name} quizThumbnail={q.thumbnail} quizSessionIDs={q.oldSessions} deleteQuiz={deleteQuiz} startGame={startGame} endGame={endGame} active={q.activeSession} questions={q.questions}>{' '}</QuizCard>)}
      </Grid>
    </div>
  );
}

export default Dashboard;
