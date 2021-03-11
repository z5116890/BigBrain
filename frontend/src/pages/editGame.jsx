import React from 'react';
import {
  Container,
  CssBaseline,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  Route,
  useRouteMatch,
  useParams,
  Switch,
} from 'react-router-dom';
import ExistingQuestion from '../components/ExistingQuestion';
import { LoginContext } from '../components/LoginContext';
import styles from '../css/editGame.module.css';
import EditSideBar from '../components/EditSideBar';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    maxHeight: '110vh',
    width: '75vw',
    overflowY: 'scroll',
  },
});
function Answer(answer = '', correct = false) {
  this.answer = answer;
  this.correct = correct;
}
// question object
// instantiate a question -> const q = new Question(...,..)
function Question(id, qno, type = 'Single Choice', time = 20, points = 1, q = '', answers = [new Answer(), new Answer(), new Answer(), new Answer()], photoURL = '', videoURL = '') {
  this.quizID = id;
  this.qno = qno;
  this.type = type;
  this.time = time;
  this.points = points;
  this.question = q;
  this.answers = [...answers];
  this.photoURL = photoURL;
  this.videoURL = videoURL;
}
function EditGame() {
  const match = useRouteMatch();
  const quizID = parseInt(useParams().quizID, 10);
  const questionNum = parseInt(useParams().qno, 10);
  // material UI css
  const classes = useStyles();
  // list of all quiz questions
  const [quizQuestions, setQuestions] = React.useState([]);
  // show the current question to edit
  const [currQuestion, setCurrentQuestion] = React.useState(new Question('initial', -1));
  // error message
  const [errorMessage, setErrorMessage] = React.useState('');
  const context = React.useContext(LoginContext);
  const { backendURL } = context;

  // submit edited game
  async function submitEditGame(e) {
    e.preventDefault();
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        questions: quizQuestions,
      }),
    };

    // attempt fetch
    try {
      const response = await fetch(`${backendURL}/admin/quiz/${quizID}`, options);
      console.log(response);
      const payload = await response.json();
      // check if email and pw combination exists
      if (response.status === 400) {
        throw new Error(payload.error);
      }
      // catch error
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  // add new question to list of questions
  // increment number of questions
  function addNewQuestion() {
    console.log('hi');
    console.log(currQuestion);
    setQuestions(
      (currentQuestions) => [...currentQuestions, new Question(quizID, quizQuestions.length + 1)],
    );
  }
  // user can delete question
  function handleDelete(e, qno) {
    console.log(e.target);
    console.log('delete', qno);
    setQuestions((old) => {
      // make sure qno for each question is updated
      const newQuestions = [];
      let index = 1;
      old.forEach((q) => {
        if (q.qno !== qno) {
          newQuestions.push(
            new Question(
              quizID,
              index,
              q.type,
              q.time,
              q.points,
              q.question,
              q.answers,
              q.photoURL,
              q.videoURL,
            ),
          );
          index += 1;
        }
        if (currQuestion.qno === qno) {
          setCurrentQuestion(new Question('deleted', -1));
        }
      });
      return newQuestions;
    });
    console.log(quizQuestions);
  }
  // answer will be deleted if user clicks delete button
  // edits the curr question
  function deleteAnswer(index) {
    console.log(index);
    if (currQuestion.answers.length > 2) {
      setCurrentQuestion((q) => {
        const newAnswers = [...q.answers];
        newAnswers.splice(index, 1);
        return new Question(
          currQuestion.id,
          currQuestion.qno,
          currQuestion.type,
          currQuestion.time,
          currQuestion.points,
          currQuestion.q,
          newAnswers,
          currQuestion.photoURL,
          currQuestion.videoURL,
        );
      });
    }
  }

  // when user clicks question card, show clicked question object so they can edit
  function handleCardClick(e, qno) {
    console.log(match.path, match.url);
    const clickedQuestion = quizQuestions.find((x) => x.qno === qno);
    setCurrentQuestion(clickedQuestion);
  }
  // check number of correct answers
  function checkAnswers() {
    let numCorrect = 0;
    currQuestion.answers.forEach((a) => {
      if (a.correct) {
        numCorrect += 1;
      }
    });
    return numCorrect;
  }
  // when user wants to edit, change the stored values of the question object
  function handleEditChange(e) {
    console.log(e.target, e.target.id, e.target.value);
    setCurrentQuestion((prev) => {
      const curr = { ...prev };
      // show edited answer and checkbox
      for (let i = 0; i < 6; i += 1) {
        if (e.target.id === `answer${i + 1}`) {
          curr.answers[i] = new Answer(e.target.value, false);
          break;
          // if user wants to make an answer correct, must check for question type (single or multi)
        } else if (e.target.name === `check${i + 1}`) {
          if (curr.type === 'Single Choice') {
            if (curr.answers[i].correct || (checkAnswers() === 0)) {
              curr.answers[i] = new Answer(curr.answers[i].answer, !(curr.answers[i].correct));
            }
          } else {
            curr.answers[i] = new Answer(curr.answers[i].answer, !(curr.answers[i].correct));
          }
        }
      }
      if (e.target.id === 'question') {
        curr.question = e.target.value;
        // if user changes question type..
      } else if (e.target.name === 'question-type') {
        // if single choice, reset correct checkboxes
        if (e.target.value === 'Single Choice') {
          const resetAnswers = [];
          curr.answers.forEach((a) => {
            resetAnswers.push(new Answer(a.answer, false));
          });
          curr.answers = resetAnswers;
        }
        curr.type = e.target.value;
      } else if (e.target.name === 'time-limit') {
        curr.time = e.target.value;
      } else if (e.target.name === 'points') {
        curr.points = parseInt(e.target.value, 10);
      } else if (e.target.id === 'youtube-link') {
        curr.videoURL = e.target.value;
      } else {
        console.log(e.target);
      }
      return curr;
    });
  }

  // when add answer is pressed, add new text field for user
  function addAnswer() {
    if (currQuestion.answers.length < 6) {
      setCurrentQuestion((prev) => {
        const curr = { ...prev };
        curr.answers.push(new Answer('', false));
        return curr;
      });
    }
  }

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
      console.log(dataURL);
      setCurrentQuestion((prev) => {
        const curr = { ...prev };
        curr.photoURL = dataURL;
        return curr;
      });
    };
    reader.readAsDataURL(file);
    return true;
  }

  // save latest changes after currQuestion is changed
  React.useEffect(() => {
    setQuestions((q) => {
      const newQuestions = [...q];
      newQuestions[currQuestion.qno - 1] = currQuestion;
      return newQuestions;
    });
  }, [currQuestion]);

  // when page renders, get list of questions to show to user
  React.useEffect(() => {
    console.log(quizID);
    console.log('start');
    // get and add existing quiz questions
    (async function getExistingQuestions() {
      // reset quizQuestions
      setQuestions(() => []);
      // get method
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
      };
      // attempt fetch
      try {
        const response = await fetch(`${backendURL}/admin/quiz/${quizID}`, options);
        console.log(response);
        const payload = await response.json();
        // check if email and pw combination exists
        if (response.status !== 200) {
          throw new Error(payload.error);
        }

        setQuestions(() => {
          // for each existing question, add to list of all questions
          const questions = [];
          payload.questions.forEach((q) => {
            questions.push(
              new Question(
                q.quizID,
                q.qno,
                q.type,
                q.time,
                q.points,
                q.question,
                q.answers,
                q.photoURL,
                q.videoURL,
              ),
            );
          });
          return questions;
        });
        // catch error
      } catch (err) {
        setErrorMessage(err.message);
      }
    }());
  }, [quizID, backendURL]);

  // when page first renders, make current question the first in the questions list
  React.useEffect(() => {
    if (quizQuestions.length > 0) {
      console.log(quizQuestions);
      if (currQuestion.quizID === 'initial') {
        console.log('yes2');
        if (Number.isNaN(questionNum) || (questionNum) > quizQuestions.length) {
          console.log('yes3');
          setCurrentQuestion(() => quizQuestions[0]);
        } else {
          console.log('yes4');
          setCurrentQuestion(() => quizQuestions[questionNum - 1]);
        }
      } else if (currQuestion.quizID === 'deleted') {
        console.log('yes5');
        setCurrentQuestion(() => quizQuestions[quizQuestions.length - 1]);
      }
    }
  }, [quizQuestions, currQuestion, questionNum]);

  return (
    <div className={styles.main_container}>
      <CssBaseline />
      {/* Questions SideBar */}
      <EditSideBar url={`/edit/${quizID}`} currQno={currQuestion.qno} quizQuestions={quizQuestions} handleDelete={handleDelete} handleCardClick={handleCardClick} addNewQuestion={addNewQuestion}>{' '}</EditSideBar>
      <Container component="main" maxWidth="lg" classes={{ root: classes.root }}>
        <div className={styles.edit_container}>
          <Typography component="h1" variant="h5">
            Edit Game
          </Typography>
          {/* Show edit question form only if the quiz has existing questions */}
          <Switch>
            <Route path={match.path}>
              {
                quizQuestions.length > 0
                && (
                  <ExistingQuestion
                    currQuestion={currQuestion}
                    onChange={(e) => handleEditChange(e)}
                    onClick={submitEditGame}
                    handleUpload={(e) => handleUpload(e)}
                    addAnswer={() => addAnswer()}
                    deleteAnswer={deleteAnswer}
                  />
                )
              }
              {/* Display message to add question if no existing questions */}
              {
                quizQuestions.length === 0
                && (
                  <Typography component="h1" variant="h5">
                    Please add new question
                  </Typography>
                )
              }
            </Route>
          </Switch>
          <Typography color="error">
            {errorMessage}
          </Typography>
        </div>
      </Container>
    </div>
  );
}

export default EditGame;
