import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

// allows user to select an answer during game
function AnswerButton(props) {
  const {
    clicked,
    answer,
    index,
    answerClick,
  } = props;
  // array of different colours
  const colors = ['#6689c3', '#0cb650', '#0b62f4', '#5ec5d3', '#ed1890', '#8e2960'];
  // css for AnswerButton. Colour is different depending on index
  const useStyles = makeStyles({
    button: {
      backgroundColor: clicked ? `${colors[index]} !important` : 'none !important',
      color: clicked ? 'white' : colors[index],
      border: `1px ${colors[index]} solid`,
      width: '100%',
      height: '100%',
    },
  });
  const classes = useStyles();
  return (
    <Button
      className={classes.button}
      onClick={() => answerClick(index)}
    >
      {answer}
    </Button>
  );
}
AnswerButton.propTypes = {
  clicked: PropTypes.bool.isRequired,
  answer: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  answerClick: PropTypes.func.isRequired,
};
export default AnswerButton;
