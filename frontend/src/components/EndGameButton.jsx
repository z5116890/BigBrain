import React from 'react';
import {
  useHistory,
} from 'react-router-dom';
import {
  Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { LoginContext } from './LoginContext';

function EndGameButton(props) {
  const { quizID, sessionID } = props;
  const context = React.useContext(LoginContext);
  const { getToken, backendURL } = context;
  const token = getToken();

  const history = useHistory();

  async function endGame() {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        quizid: quizID,
      },
    };
    try {
      const response = await fetch(`${backendURL}/admin/quiz/${quizID}/end`, options);
      const payload = await response.json();
      if (response.status !== 400) {
        history.push(`/results/${sessionID}`);
      } else {
        throw new Error(payload.error);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => endGame()}
      area-label="end game button"
    >
      End game
    </Button>
  );
}

EndGameButton.propTypes = {
  quizID: PropTypes.string.isRequired,
  sessionID: PropTypes.string.isRequired,
};

export default EndGameButton;
