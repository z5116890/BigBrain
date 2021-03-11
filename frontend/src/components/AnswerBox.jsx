import React from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  makeStyles,
  TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import BackspaceSharpIcon from '@material-ui/icons/BackspaceSharp';

// material UI css
const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  greenCheck: {
    color: '#66bb6a !important',
    '&$checked': {
      color: '#66bb6a !important',
    },
    position: 'absolute',
    zIndex: 1,
    bottom: '40px',
    right: '0px',
  },
  container: {
    position: 'relative',
  },
  close: {
    position: 'absolute',
    zIndex: 1,
    top: '0px',
    right: '-12px',
    '&:hover': {
      cursor: 'pointer',
    },
    width: '15px',
    fontSize: '20px',
  },
}));
// Component that allows user to enter answer or delete answer when editing
function AnswerBox(props) {
  const {
    length,
    correct,
    answer,
    onChange,
    index,
    deleteAnswer,
  } = props;
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  return (
    <Grid className={classes.container} item xs={matches ? 12 : 6}>
      <Button
        className={classes.close}
        onClick={() => deleteAnswer(index)}
        color="secondary"
        disabled={(length === 2)}
      >
        <BackspaceSharpIcon />
      </Button>
      <TextField className={classes.paper} variant="outlined" margin="normal" required fullWidth id={`answer${index + 1}`} label={`Answer ${index + 1}`} autoFocus onChange={onChange} value={answer} />
      <FormControlLabel
        control={<Checkbox className={classes.greenCheck} checked={correct} onChange={onChange} name={`check${index + 1}`} />}
      />
    </Grid>
  );
}

AnswerBox.propTypes = {
  length: PropTypes.number.isRequired,
  correct: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  deleteAnswer: PropTypes.func.isRequired,
  answer: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
export default AnswerBox;
