import React from 'react';
import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DeleteIcon from '@material-ui/icons/Delete';

// Question card is the individual questions that appear on editsidebar
function QuestionCard(props) {
  const {
    url,
    currQno,
    qno,
    question,
    onClick,
    handleDelete,
  } = props;

  const useStyles = makeStyles({
    root: {
      width: '100%',
      height: '140px',
      margin: 2,
      '&:hover': {
        cursor: 'pointer',
      },
      backgroundColor: (currQno === qno) ? '#ebf4fc' : '#FFFFFF',
    },
    container: {
      width: useMediaQuery('(max-width:700px)') ? '160px' : '100%',
      height: '140px',
      position: 'relative',
      marginTop: '2%',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    close: {
      position: 'absolute',
      top: '2px',
      right: '0px',
      '&:hover': {
        cursor: 'pointer',
      },
      width: '15px',
      fontSize: 'large',
    },
  });
  const classes = useStyles();

  return (
    <div id="question-card" className={classes.container}>
      {/* Clickable card */}
      <Button
        aria-label="delete-question-button"
        className={classes.close}
        onClick={(e) => handleDelete(e, qno)}
        color="secondary"
      >
        <DeleteIcon />
      </Button>
      <Link to={`${url}/${qno}`}>
        <Card aria-label={`question-card-${qno}`} id="question-card" hoverable="true" key={qno} onClick={(e) => onClick(e, qno)} className={classes.root}>
          <CardContent>
            <Typography data-test="qno" className={classes.title} color="textSecondary" gutterBottom>
              {`Question ${qno}`}
            </Typography>
            <Typography data-test="question" className={classes.pos} color="textSecondary">
              {question}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
QuestionCard.propTypes = {
  url: PropTypes.string.isRequired,
  currQno: PropTypes.number.isRequired,
  qno: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
export default QuestionCard;
