import React from 'react';
import {
  makeStyles,
  Modal,
  Backdrop,
  Button,
  List,
  ListItem,
  Box,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 'none',
  },
  paginator: {
    justifyContent: 'center',
    padding: '10px',
  },
  results: {
    position: 'absolute',
    bottom: '5px',
    right: '102px',
  },
}));

function QuizResultsLinksModal(props) {
  const {
    quizSessionIDs,
  } = props;
  const classes = useStyles();

  // For modal
  const [open, setOpen] = React.useState(false);

  // For pagination
  const numItemsPerPage = 5; // The number of items to display on one page
  const [currentPageNum, setCurrentPageNum] = React.useState(1);
  const [numPages] = React.useState(Math.ceil(quizSessionIDs.length / numItemsPerPage));

  // Individual button that when clicked takes you to the results page for that session
  function LinkToSessionResults(sessionID) {
    return (
      <ListItem key={sessionID}>
        <Button component={Link} to={`/results/${sessionID}`} size="small" color="primary">
          {sessionID}
        </Button>
      </ListItem>
    );
  }

  return (
    <div>
      <Button className={classes.results} size="small" color="primary" onClick={() => setOpen(true)}>
        View Results
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
        BackdropComponent={Backdrop}
      >
        <div className={classes.paper}>
          <h2 id="transition-modal-title">Results</h2>
          <p id="transition-modal-description">Click on a session to see its results</p>
          <List dense component="span">
            {quizSessionIDs
              .slice((currentPageNum - 1) * numItemsPerPage, currentPageNum * numItemsPerPage)
              .map((sessionID) => LinkToSessionResults(sessionID))}
          </List>
          <Box component="span">
            <Pagination
              count={numPages}
              page={currentPageNum}
              onChange={(event, num) => setCurrentPageNum(num)}
              defaultPage={1}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              classes={{ ul: classes.paginator }}
            />
          </Box>
        </div>
      </Modal>
    </div>
  );
}

QuizResultsLinksModal.propTypes = {
  quizSessionIDs: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default QuizResultsLinksModal;
