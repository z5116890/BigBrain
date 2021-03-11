import * as React from 'react';
import {
  AppBar,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { Home } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import { Link, useLocation, useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Logout from './Logout';
import styles from '../css/navigation.module.css';
import CreateGameModal from './CreateGameModal';
import { LoginContext } from './LoginContext';

// Header that exists on every page for navigation
function Header() {
  const context = React.useContext(LoginContext);
  const { isLoggedIn } = context;
  const location = useLocation();
  const matches = useMediaQuery('(min-width:800px)');

  function LoggedInButtons() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const history = useHistory();
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };
    const closeEdit = () => {
      setAnchorEl(null);
      history.push('/dashboard');
    };
    const handleJoin = () => {
      setAnchorEl(null);
      history.push('/joinGame');
    };
    if (matches) {
      return (
        <List component="nav" aria-labelledby="main navigation" className={styles.navBarContainer}>
          <Link id="joinGame" to="/joinGame" className={styles.linkText}>
            <Button className={styles.linkText} area-label="join game" variant="contained" color="primary">
              Join Game
            </Button>
          </Link>
          {!(/edit\/[0-9]+/.test(location.pathname)) && <CreateGameModal responsive={false} />}
          {/edit\/[0-9]+/.test(location.pathname)
            ? (
              <Link to="/dashboard" className={styles.linkText}>
                <Button
                  aria-label="close-edit"
                  variant="contained"
                  color="primary"
                >
                  Close
                </Button>
              </Link>
            ) : <Logout responsive={false} />}
        </List>
      );
    }
    return (
      <div className={styles.menuContainer}>
        <Button aria-expanded={anchorEl !== null} data-test="menu-button" aria-label="menu" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={styles.menuButton}>
          <MenuIcon />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleJoin}>Join Game</MenuItem>
          {!(/edit\/[0-9]+/.test(location.pathname)) && <CreateGameModal responsive />}
          {/edit\/[0-9]+/.test(location.pathname)
            ? (
              <MenuItem onClick={closeEdit}>Close</MenuItem>
            )
            : (
              <Logout responsive />
            )}
        </Menu>
      </div>
    );
  }

  function LoggedOutButtons() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const history = useHistory();
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleLogin = () => {
      setAnchorEl(null);
      history.push('/login');
    };
    const handleRegister = () => {
      setAnchorEl(null);
      history.push('/register');
    };
    const handleJoin = () => {
      setAnchorEl(null);
      history.push('/joinGame');
    };
    if (matches) {
      return (
        <List component="nav" aria-labelledby="main navigation" className={styles.navBarContainer}>
          <Link id="joinGame" to="/joinGame" className={styles.linkText}>
            <ListItem button aria-label="joinGame">
              <ListItemText primary="JoinGame" />
            </ListItem>
          </Link>
          <Link id="login" to="/login" className={styles.linkText}>
            <ListItem button aria-label="login">
              <ListItemText primary="Login" />
            </ListItem>
          </Link>
          <Link id="register" to="/register" className={styles.linkText}>
            <ListItem button aria-label="register">
              <ListItemText primary="Register" />
            </ListItem>
          </Link>
        </List>
      );
    }
    return (
      <div className={styles.menuContainer}>
        <Button aria-expanded={anchorEl !== null} data-test="menu-button" aria-label="menu" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={styles.menuButton}>
          <MenuIcon />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleJoin}>Join Game</MenuItem>
          <MenuItem onClick={handleLogin}>Login</MenuItem>
          <MenuItem onClick={handleRegister}>Register</MenuItem>
        </Menu>
      </div>
    );
  }

  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <Container className={styles.navBarContainer}>
            <Link id="home-button" to={(isLoggedIn ? '/dashboard' : '/login')} className={styles.linkText}>
              <IconButton edge="start" color="inherit" aria-label="home">
                <Home fontSize="large" />
              </IconButton>
            </Link>
          </Container>
          {isLoggedIn ? <LoggedInButtons /> : <LoggedOutButtons />}
        </Toolbar>
      </AppBar>
    </header>
  );
}

export default Header;
