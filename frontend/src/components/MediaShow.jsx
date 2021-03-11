import React from 'react';
import {
  Container,
  makeStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  image: {
    width: '30%',
  },
});
function MediaShow(props) {
  const { videoURL, photoURL } = props;
  const classes = useStyles();
  return (
    <Container maxWidth="md" className={classes.root}>
      {photoURL !== ''
      && (
        <img id="preview" className={classes.image} src={photoURL} alt="question-related" />
      )}
      {videoURL !== ''
      && (
        <ReactPlayer
          url={videoURL}
          playing
          width="50%"
          height="32vh"
        />
      )}
    </Container>
  );
}
MediaShow.defaultProps = {
  videoURL: '',
  photoURL: '',
};
MediaShow.propTypes = {
  videoURL: PropTypes.string,
  photoURL: PropTypes.string,
};
export default MediaShow;
