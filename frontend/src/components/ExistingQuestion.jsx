import React from 'react';
import {
  TextField,
  makeStyles,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Button,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  ClickAwayListener,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from '../css/editGame.module.css';
import AnswerBox from './AnswerBox';

// material UI css
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 28,
    right: 0,
    left: 0,
    zIndex: 1,
    border: '1px solid',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  saveButton: {
    display: 'inherit',
    alignItems: 'inherit',
    justifyContent: 'inherit',
    position: 'absolute',
    top: '14px',
    right: '112px',
    width: '85px',
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  paperURL: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '10%',
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    minWidth: '50%',
  },
  points: {
    margin: '4%',
  },
  input: {
    display: 'none',
    marginBottom: '10%',
  },
  button: {
    marginBottom: '10%',
  },
  image: {
    width: '100%',
    height: '100%',
    marginBottom: '5%',
  },
  greenCheck: {
    color: '#66bb6a !important',
    '&$checked': {
      color: '#66bb6a !important',
    },
  },
}));

// Shows the current Question to be edited
function ExistingQuestion(props) {
  const classes = useStyles();
  const {
    currQuestion,
    onChange,
    onClick,
    handleUpload,
    addAnswer,
    deleteAnswer,
  } = props;
  // state for saved notification
  const [saved, setSaved] = React.useState(false);
  function handleSave() {
    setSaved((prev) => !prev);
  }
  // save icon will disappear
  function handleClickAway() {
    setSaved(false);
  }
  return (
    <div className={styles.question_type_container}>
      {/* Points Type i.e. Normal, Double, Triple */}
      <FormControl component="fieldset">
        <RadioGroup className={styles.points_container} id="points" row aria-label="position" name="points" defaultValue="top" onChange={onChange} value={currQuestion.points}>
          <FormControlLabel
            value={1}
            control={<Radio color="primary" />}
            label="Normal Points"
            labelPlacement="bottom"
          />
          <FormControlLabel
            value={2}
            control={<Radio color="primary" />}
            label="Double Points"
            labelPlacement="bottom"
          />
          <FormControlLabel
            value={3}
            control={<Radio color="primary" />}
            label="Triple Points"
            labelPlacement="bottom"
          />
        </RadioGroup>
      </FormControl>
      {/* Upload Photo or YouTube URL */}
      <div className={styles.media_container}>
        <div className={styles.img_vid_container}>
          <div className={styles.img_container}>
            <div className={styles.img_box}>
              {currQuestion.photoURL !== '' && <img className={classes.image} id="preview" src={currQuestion.photoURL} alt="question" />}
            </div>
            <label htmlFor="contained-button-file" className={classes.button}>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleUpload}
              />
              <Button variant="contained" color="primary" component="span">
                Upload Photo
              </Button>
            </label>
          </div>
          <div className={styles.vid_container}>
            <TextField className={classes.paperURL} variant="outlined" margin="normal" fullWidth id="youtube-link" label="YouTube Link" autoFocus onChange={onChange} value={currQuestion.videoURL} />
          </div>
        </div>
      </div>
      {/* Select Question Type i.e. Single, Multi type */}
      <div id={`input-container-${currQuestion.qno}`} className={styles.inputContainer}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Question Type</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            value={currQuestion.type}
            name="question-type"
            onChange={onChange}
            label="Question Type"
            required
          >
            <MenuItem value="Single Choice">Single Choice</MenuItem>
            <MenuItem value="Multi Choice">Multi Choice</MenuItem>
          </Select>
        </FormControl>
        {/* Set Time Limit */}
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Time Limit</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            value={currQuestion.time}
            name="time-limit"
            onChange={onChange}
            label="Time Limit"
            required
          >
            <MenuItem value={5}>5 seconds</MenuItem>
            <MenuItem value={10}>10 seconds</MenuItem>
            <MenuItem value={20}>20 seconds</MenuItem>
            <MenuItem value={30}>30 seconds</MenuItem>
            <MenuItem value={60}>60 seconds</MenuItem>
            <MenuItem value={120}>120 seconds</MenuItem>
            <MenuItem value={240}>240 seconds</MenuItem>
          </Select>
        </FormControl>
        {/* Enter Question */}
        <TextField variant="outlined" margin="normal" required fullWidth id="question" label={`Question ${currQuestion.qno}`} autoFocus onChange={onChange} value={currQuestion.question} />
        {/* Enter Answer */}
        <div className={styles.answer_container}>
          <Grid container spacing={1}>
            {currQuestion.answers.map(
              (a, index) => (
                <AnswerBox
                  key={`answer-${(currQuestion.answers.length - index)}`}
                  length={currQuestion.answers.length}
                  index={index}
                  correct={a.correct}
                  answer={a.answer}
                  onChange={onChange}
                  deleteAnswer={deleteAnswer}
                />
              ),
            )}
          </Grid>
        </div>
        {/* Add Answer */}
        <Button
          className={styles.edit_button}
          variant="contained"
          color="primary"
          onClick={addAnswer}
          disabled={((currQuestion.answers.length === 6))}
        >
          Add Answer
        </Button>
        {/* Edit Button */}
        <ClickAwayListener onClickAway={handleClickAway}>
          <div>
            <Button
              className={styles.saveButton}
              variant="contained"
              color="primary"
              onClick={(e) => {
                handleSave();
                onClick(e);
              }}
            >
              Save
            </Button>
            {saved ? (
              <div className={styles.dropDown}>
                Saved!
              </div>
            ) : null}
          </div>
        </ClickAwayListener>
        <br />
        <br />
      </div>
    </div>
  );
}

ExistingQuestion.propTypes = {
  currQuestion: PropTypes.oneOfType([PropTypes.object]).isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  addAnswer: PropTypes.func.isRequired,
  deleteAnswer: PropTypes.func.isRequired,
  handleUpload: PropTypes.func.isRequired,
};

export default ExistingQuestion;
