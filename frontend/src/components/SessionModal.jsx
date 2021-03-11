import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import copy from 'clipboard-copy';
import { LoginContext } from './LoginContext';

const useStyles = makeStyles({
  buttonMessage: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

// modal that appears when user creates a game
function SessionModal(props) {
  const {
    open,
    setOpen,
    sessionID,
    title,
    message,
    active,
  } = props;
  const classes = useStyles();
  const context = React.useContext(LoginContext);
  const { localhostURL } = context;
  const [linkCopied, setLinkCopied] = React.useState(false);
  function copyLink(session) {
    setLinkCopied(() => true);
    copy(`${localhostURL}/joinGame/${session}`);
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
        {(active)
          && (
            <div>
              <TextField
                autoFocus
                margin="dense"
                id="newGameName"
                label="Link"
                value={`${localhostURL}/join/${sessionID}`}
                fullWidth
              />
              <div className={classes.buttonMessage}>
                <Button size="small" color="primary" onClick={() => copyLink(sessionID)}>
                  Copy Link
                </Button>
                {linkCopied
                  && (
                    <span>Link Copied!</span>
                  )}
              </div>
            </div>
          )}
        {(!active)
          && (
            // TODO need to get the session to link to
            <Button component={Link} to={`/results/${sessionID}`} size="small" color="primary">
              View Results
            </Button>
          )}
      </DialogContent>
    </Dialog>
  );
}

SessionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  sessionID: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
};

export default SessionModal;
