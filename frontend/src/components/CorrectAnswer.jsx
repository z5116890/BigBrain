import React from 'react';
import { Typography, Card, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import PropTypes from 'prop-types';

// Shows user if their answer is correct or not through box border colour and tick or cross icon
function CorrectAnswer(props) {
  const {
    correct,
    answer,
  } = props;
  const useStyles = makeStyles({
    tick: {
      fill: 'green',
    },
    cross: {
      fill: 'red',
    },
    root: {
      border: correct ? 'green solid 1px !important' : 'red solid 1px !important',
      marginTop: '2px',
      width: '40%',
      height: '100%',
    },
    text: {
      textAlign: 'center',
      color: 'black',
    },
  });
  const classes = useStyles();

  return (
    <Card id="answer" className={classes.root}>
      <Typography data-test="answer" className={classes.text} variant="h5" component="h2">
        {answer}
        {correct
          ? (<CheckIcon id="tick" className={classes.tick} />)
          : (<CloseIcon id="cross" className={classes.cross} />)}
      </Typography>
    </Card>
  );
}
CorrectAnswer.propTypes = {
  correct: PropTypes.bool.isRequired,
  answer: PropTypes.string.isRequired,
};
export default CorrectAnswer;
