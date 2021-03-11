import React from 'react';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from '../css/editGame.module.css';
import QuestionCard from './QuestionCard';

// sidebar contains questions that the user can select to edit the question
// user can also delete or add a question on the sidebar
function EditSideBar(props) {
  const {
    url,
    currQno,
    quizQuestions,
    handleCardClick,
    addNewQuestion,
    handleDelete,
  } = props;
  return (
    <div className={styles.side_container}>
      {/* Create Clickable Card for each question */}
      <div className={styles.questions_list_container}>
        {quizQuestions && quizQuestions.map((q) => <QuestionCard url={url} quizID={q.quizID} currQno={currQno} key={q.qno} qno={q.qno} question={q.question} handleDelete={handleDelete} onClick={handleCardClick}>{' '}</QuestionCard>)}
      </div>
      <div className={styles.add_button}>
        <Button
          aria-label="add-question"
          className={styles.edit_button}
          variant="contained"
          color="primary"
          onClick={addNewQuestion}
        >
          +
        </Button>
      </div>
    </div>
  );
}
EditSideBar.propTypes = {
  url: PropTypes.string.isRequired,
  currQno: PropTypes.number.isRequired,
  quizQuestions: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleCardClick: PropTypes.func.isRequired,
  addNewQuestion: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
export default EditSideBar;
