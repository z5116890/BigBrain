import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import EditGame from './pages/editGame';
import Header from './components/header';
import Dashboard from './pages/Dashboard';
import { LoginContext } from './components/LoginContext';
import SessionResults from './pages/SessionResults';
import JoinGame from './pages/JoinGame';
import HostReadyUp from './pages/HostReadyUp';
import PlayGame from './pages/PlayGame';
import PlayerResults from './pages/PlayerResults';
import HostGameScreen from './pages/HostGameScreen';

function App() {
  const { isLoggedIn } = React.useContext(LoginContext);
  if (!isLoggedIn) {
    return (
      <>
        <Router>
          <Header />
          <div>
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
              <Route
                exact
                path="/joinGame"
              >
                <JoinGame />
              </Route>
              <Route
                exact
                path="/joinGame/:sessionID"
              >
                <JoinGame />
              </Route>
              <Route
                exact
                path="/play/:playerID"
              >
                <PlayGame />
              </Route>
              <Route
                exact
                path="/results/:playerID"
              >
                <PlayerResults />
              </Route>
              <Route
                exact
                path="/"
              >
                <Login />
              </Route>
            </Switch>
          </div>
        </Router>
      </>
    );
  }
  return (
    <>
      <Router>
        <Header />
        <div>
          <Switch>
            <Route
              exact
              path="/dashboard"
            >
              <Dashboard />
            </Route>
            <Route
              exact
              path="/edit/:quizID"
            >
              <EditGame />
            </Route>
            <Route
              exact
              path="/edit/:quizID/:qno"
            >
              <EditGame />
            </Route>
            <Route
              exact
              path="/results/:sessionID"
            >
              <SessionResults />
            </Route>
            <Route
              exact
              path="/HostReadyUp/:quizID/:sessionID"
            >
              <HostReadyUp />
            </Route>
            <Route
              exact
              path="/hostScreen/:sessionID"
            >
              <HostGameScreen />
            </Route>
            <Route
              exact
              path="/joinGame"
            >
              <JoinGame />
            </Route>
            <Route
              exact
              path="/joinGame/:sessionID"
            >
              <JoinGame />
            </Route>
            <Route
              path="/"
            >
              <Dashboard />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
