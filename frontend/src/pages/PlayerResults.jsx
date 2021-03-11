import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  Container,
} from '@material-ui/core';
import {
  useParams,
} from 'react-router-dom';
import { LoginContext } from '../components/LoginContext';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  table: {
    minWidth: 200,
  },
  correct_row: {
    background: 'LightGreen',
    fontSize: 'large',
  },
  incorrect_row: {
    background: 'LightCoral',
    fontSize: 'large',
  },
  tabletext: {
    fontSize: 'large',
    fontWeight: '900',
  },
}));

function QuestionsCorrectTable(info) {
  const classes = useStyles();
  const { results } = info;
  console.log(info);
  console.log(results);
  const numQuestions = results.length;
  const questionNums = [...Array(numQuestions).keys()].map((k) => k + 1);

  // If indices to not line up then must sort by time started so they do line up
  const data = questionNums.map((qNum) => {
    const { correct } = results[qNum - 1];
    return { qNum, correct };
  });

  return (
    <Container component="main">
      <div container className={classes.paper}>
        <h1>Your results</h1>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="questions correct table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tabletext}>Question number</TableCell>
                <TableCell className={classes.tabletext} align="right">Correct?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  className={row.correct ? classes.correct_row : classes.incorrect_row}
                  key={row.qNum}
                >
                  <TableCell className={classes.tabletext} component="th" scope="row">
                    {row.qNum}
                  </TableCell>
                  <TableCell className={classes.tabletext} align="right">
                    {row.correct
                      ? 'Yes'
                      : 'No'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
}

function PlayerResults() {
  const [results, setResults] = React.useState({ results: [] });
  console.log(results);
  const context = React.useContext(LoginContext);
  const { getToken, backendURL } = context;
  const token = getToken();

  const params = useParams();
  const { playerID } = params;

  // First get all player results for this session
  React.useEffect(() => {
    (async function getResults() {
      console.log(playerID);
      const options = {
        method: 'GET',
        headers: {
          playerid: playerID,
        },
      };
      try {
        const response = await fetch(`${backendURL}/play/${playerID}/results`, options);
        const resultsArray = await response.json();
        if (response.status !== 200) {
          throw new Error(resultsArray.error);
        }
        console.log(resultsArray);
        setResults(() => resultsArray);
      } catch (err) {
        console.log(err);
      }
    }());
  }, [backendURL, token, playerID]);

  console.log(results);
  return (
    <div>
      {results.length > 0
        ? (
          <div>
            <QuestionsCorrectTable results={results} />
          </div>
        ) : <p>Results is empty!</p>}
    </div>
  );
}

export default PlayerResults;
