import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, MenuItem } from '@material-ui/core';
import { LoginContext } from './LoginContext';

let token;
let backendurl;
let quizID;
const useStyles = makeStyles(() => ({
  createButton: {
    width: '145px',
  },
  input: {
    display: 'none',
  },
}));

async function createGame(nameInput) {
  console.log(nameInput);
  if (nameInput === '') return;
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: nameInput,
    }),
  };

  try {
    console.log(options);
    const response = await fetch(`${backendurl}/admin/quiz/new`, options);
    const payload = await response.json();
    console.log(payload);

    if (response.status === 400) {
      throw new Error(payload.error);
    }
    quizID = payload.quizId;
    console.log(quizID);
  } catch (err) {
    console.log(err);
  }
}

async function uploadFullGame(content) {
  console.log(quizID);
  console.log(content);
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(content),
  };
  // attempt fetch
  try {
    const response = await fetch(`${backendurl}/admin/quiz/${quizID}`, options);
    console.log(response);
    const payload = await response.json();

    if (response.status === 400) {
      throw new Error(payload.error);
    }
    // catch error
  } catch (err) {
    console.log(err);
  }
}

function UploadGameButton(info) {
  const classes = useStyles();
  const { nameInput, setOpen } = info;

  async function handleUpload(e) {
    e.stopPropagation();
    if (nameInput === '') return;

    // Extract json object from file
    const [file] = e.target.files;
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async (ev) => {
      const res = ev.target.result;
      const content = await JSON.parse(res);

      // Create a new game then edit the details to match the json file
      await createGame(nameInput);
      await uploadFullGame(content);
      setOpen(false);
    };
  }

  return (
    <div>
      <label htmlFor="contained-button-file">
        <input
          className={classes.input}
          accept=".json"
          id="contained-button-file"
          multiple
          type="file"
          onChange={(e) => handleUpload(e)}
        />
        <Button color="primary" component="span">
          Upload Game
        </Button>
      </label>
    </div>
  );
}

function CreateGameModal({ responsive }) {
  const [open, setOpen] = React.useState(false);
  const [nameInput, setNameInput] = React.useState('');
  const classes = useStyles();

  const context = React.useContext(LoginContext);
  const { backendURL, getToken } = context;
  backendurl = backendURL;
  token = getToken();

  return (
    <div>
      {!responsive
        && (
          <Button className={classes.createButton} area-label="create game" variant="contained" color="primary" onClick={() => setOpen(true)}>
            Create Game
          </Button>
        )}
      {responsive
      && (
        <MenuItem onClick={() => setOpen(true)}>Create Game</MenuItem>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="create game modal">
        <DialogTitle id="form-dialog-title">Create a new game</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name below. You can edit the details and add questions later.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="newGameName"
            label="Name"
            value={nameInput}
            error={nameInput === ''}
            helperText={nameInput === '' ? '*Required' : ' '}
            onChange={(e) => { setNameInput(e.target.value); console.log(nameInput); }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            color="primary"
            area-label="cancel button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              window.location.reload(true);
              createGame(nameInput);
              setOpen(false);
            }}
            color="primary"
            area-label="submit button"
          >
            Create
          </Button>
          <UploadGameButton
            nameInput={nameInput}
            setOpen={setOpen}
            area-label="upload game button"
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}

CreateGameModal.propTypes = {
  responsive: PropTypes.bool.isRequired,
};
export default CreateGameModal;
