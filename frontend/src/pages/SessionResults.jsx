import React from 'react';
import {
  useParams,
} from 'react-router-dom';
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
  Box,
} from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import { LoginContext } from '../components/LoginContext';

const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },
  graphContainer: {
    padding: '15px',
    marginBottom: '25px',
  },
  chart: {
    border: '1px solid black',
    minWidth: 200,
  },
  chart_header: {
    fontSize: 'calc(10px + 2vw)',
  },
  table_row: {
    fontSize: 'large',
  },
  table_first_row: {
    background: 'LightSkyBlue',
    fontSize: 'large',
    fontWeight: '900',
  },
  box: {
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    '&:hover': {
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    },
  },
  no_results: {
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'grey',
  },
});

function TopFiveTable(results) {
  const classes = useStyles();

  // Add player score to each entry so the results can be sorted
  function insertPlayerScore(playerResults) {
    const reducer = (totalScore, currentAnswer) => totalScore + (currentAnswer.correct ? 1 : 0);
    const playerResultsWithScore = playerResults;
    playerResultsWithScore.score = playerResults.answers.reduce(reducer, 0);
    return playerResultsWithScore;
  }

  const topFive = results.results
    .map((playerResults) => insertPlayerScore(playerResults))
    // Sort by score descending
    .sort((a, b) => {
      if (a.score > b.score) return -1;
      if (a.score < b.score) return 1;
      return 0;
    })
    // Get up to top 5
    .slice(0, 5)
    // Put data into table
    .map((topPlayer) => {
      const { name, score } = topPlayer;
      return { name, score };
    });

  return (
    <Container>
      <h1 className={classes.chart_header}>Top scorers</h1>
      <Box className={classes.box}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="top players table">
            <TableHead>
              <TableRow className={classes.table_first_row}>
                <TableCell>Player name</TableCell>
                <TableCell align="right">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topFive.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

function PercentageCorrectChart(results) {
  const res = results.results;
  const numQuestions = res[0].answers.length;
  const classes = useStyles();

  // Assuming each index identifies the same question in each player's answers array,
  // numCorrect will store how many got that question correct
  const numCorrect = Array(numQuestions).fill(0);
  res.forEach((playerResults) => {
    for (let q = 0; q < numQuestions; q += 1) {
      numCorrect[q] += (playerResults.answers[q].correct ? 1 : 0);
    }
  });

  const numPlayers = res.length;
  // Get percentage of players who answered each quesion correctly
  const percentageCorrect = Array(numQuestions).fill(0);
  for (let q = 0; q < numQuestions; q += 1) {
    percentageCorrect[q] = (100 * numCorrect[q]) / numPlayers;
  }

  // Q1, Q2, Q3, ...
  const label = [...Array(numQuestions).keys()].map((k) => `Q${k + 1}`);
  console.log(label);
  console.log(percentageCorrect);

  // Create line chart
  const data = {
    labels: label,
    datasets: [
      {
        fill: true,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
        data: percentageCorrect,
      },
    ],
  };

  const options = {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          min: 0,
        },
      }],
    },
  };

  return (
    <Container>
      <h1 className={classes.chart_header}>Percentage answered correctly</h1>
      <Box className={classes.box}>
        <div className={classes.graphContainer} area-label="Percentage answered correctly chart">
          <Line
            data={data}
            options={options}
          />
        </div>
      </Box>
    </Container>
  );
}

function AvgResponseTimeChart(results) {
  const res = results.results;
  const numQuestions = res[0].answers.length;
  const classes = useStyles();

  // Assuming each index identifies the same question in each player's answers array,
  // avgResponseTime will store how many got that question correct
  const avgResponseTime = Array(numQuestions).fill(0);
  res.forEach((playerResults) => {
    for (let q = 0; q < numQuestions; q += 1) {
      const responseTimeSecs = (
        Date.parse(playerResults.answers[q].answeredAt)
        - Date.parse(playerResults.answers[q].questionStartedAt)) / 1000.0;
      avgResponseTime[q] += responseTimeSecs;
    }
  });
  for (let q = 0; q < numQuestions; q += 1) {
    avgResponseTime[q] /= res.length;
  }

  // Q1, Q2, Q3, ...
  const label = [...Array(numQuestions).keys()].map((k) => `Q${k + 1}`);
  // Create line chart
  const data = {
    labels: label,
    datasets: [
      {
        fill: true,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
        data: avgResponseTime,
      },
    ],
  };

  const options = {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          min: 0,
        },
      }],
    },
  };

  return (
    <Container>
      <h1 className={classes.chart_header}>Average response time</h1>
      <Box className={classes.box}>
        <div className={classes.graphContainer} area-label="Average response time chart">
          <Line
            data={data}
            options={options}
          />
        </div>
      </Box>
    </Container>
  );
}

function NoResults() {
  const classes = useStyles();
  return (
    <div className={classes.no_results}>
      <h1>No Results</h1>
    </div>
  );
}

function SessionResults() {
  const context = React.useContext(LoginContext);
  const { getToken, backendURL } = context;
  const token = getToken();
  const [results, setResults] = React.useState([]);

  const params = useParams();
  const { sessionID } = params;

  // First get all results for this session
  React.useEffect(() => {
    (async function getResults() {
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await fetch(`${backendURL}/admin/session/${sessionID}/results`, options);
        const resultsObject = await response.json();
        if (response.status !== 200) {
          throw new Error(resultsObject.error);
        }
        setResults(() => resultsObject.results);
      } catch (err) {
        console.log(err);
      }
    }());
  }, [backendURL, token, sessionID]);

  console.log(results);

  return (
    <div>
      {results.length > 0
        ? (
          <div>
            <TopFiveTable results={results} />
            <PercentageCorrectChart results={results} />
            <AvgResponseTimeChart results={results} />
          </div>
        ) : <NoResults />}
    </div>
  );
}

export default SessionResults;
