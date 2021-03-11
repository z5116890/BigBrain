import React from 'react';
import { Button, MenuItem } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LoginContext } from './LoginContext';

// Logout button shown on header
function Logout({ responsive }) {
  const history = useHistory();
  const context = React.useContext(LoginContext);

  if (!responsive) {
    return (
      <Button
        area-label="logout"
        variant="contained"
        color="primary"
        onClick={() => {
          localStorage.clear();
          context.finaliseLogout();
          history.push('/login');
        }}
      >
        Logout
      </Button>
    );
  }
  return (
    <MenuItem
      area-label="logout"
      onClick={() => {
        localStorage.clear();
        context.finaliseLogout();
        history.push('/login');
      }}
    >
      Logout
    </MenuItem>
  );
}
Logout.propTypes = {
  responsive: PropTypes.bool.isRequired,
};
export default Logout;
