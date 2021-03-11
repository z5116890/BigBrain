// For maintaining the same login state across all components
// URL FOR BACKEND AND FRONTEND DEFINED HERE
import React from 'react';
import PropTypes from 'prop-types';

export const LoginContext = React.createContext();

function LoginContextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // If token exists in storage on mount, user is still logged in
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  const finaliseLogin = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const finaliseLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  const getToken = () => localStorage.getItem('token');

  // CHANGE IF NECESSARY
  const backendURL = 'http://localhost:5005';
  const localhostURL = 'http://localhost:3000';

  // Can be accessed by all components
  const store = {
    isLoggedIn,
    finaliseLogin,
    finaliseLogout,
    getToken,
    backendURL,
    localhostURL,
  };

  return (
    <LoginContext.Provider value={store}>
      {children}
    </LoginContext.Provider>
  );
}

LoginContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default LoginContextProvider;
