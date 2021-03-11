import React from 'react';
import renderer from 'react-test-renderer';
import { createShallow } from '@material-ui/core/test-utils';
import { Button, IconButton } from '@material-ui/core';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import styles from '../css/navigation.module.css';

describe('Header', () => {
  let shallow;
  beforeAll(() => {
    shallow = createShallow({ dive: true });
  });
  it('has a home icon button that should redirect to another page when clicked and also has aria-label', () => {
    // test click and aria label
    const onClick = jest.fn();
    const buttonWrapper = shallow(<IconButton onClick={onClick} edge="start" color="inherit" aria-label="home" />);
    buttonWrapper.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(buttonWrapper.props()['aria-label']).toEqual('home');
    let isLoggedIn = true;
    let wrapper = shallow(<Router><Link id="home-button" to={(isLoggedIn ? '/dashboard' : '/login')} className={styles.linkText} /></Router>);
    expect(wrapper.find('#home-button')).toHaveLength(1);
    expect(wrapper.find('#home-button').props().to).toBe('/dashboard');
    isLoggedIn = false;
    wrapper = shallow(<Router><Link id="home-button" to={(isLoggedIn ? '/dashboard' : '/login')} className={styles.linkText} /></Router>);
    expect(wrapper.find('#home-button').props().to).toBe('/login');
  });
  it('has a logout button that should trigger when clicked and also has aria-label', () => {
    const onClick = jest.fn();
    const buttonWrapper = shallow(
      <Button
        aria-label="logout"
        variant="contained"
        color="primary"
        onClick={onClick}
      >
        Logout
      </Button>,
    );
    buttonWrapper.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(buttonWrapper.props()['aria-label']).toEqual('logout');
  });
  it('has a close button that should trigger when clicked and also has aria-label', () => {
    const onClick = jest.fn();
    const buttonWrapper = shallow(
      <Button
        onClick={onClick}
        aria-label="close-edit"
        variant="contained"
        color="primary"
      >
        Logout
      </Button>,
    );
    buttonWrapper.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(buttonWrapper.props()['aria-label']).toEqual('close-edit');
  });
  it('has a login and register link that has specific path', () => {
    const loginWrapper = shallow(
      <Router>
        <Link id="login" to="/login" className={styles.linkText}>
          Login
        </Link>
      </Router>,
    );
    expect(loginWrapper.find('#login').props().to).toBe('/login');
    const registerWrapper = shallow(
      <Router>
        <Link id="register" to="/register" className={styles.linkText}>
          Register
        </Link>
      </Router>,
    );
    expect(registerWrapper.find('#register').props().to).toBe('/register');
  });
  // Snapshots. Making sure component does not change unexpectedly by
  // comparing a reference snapshot with test snapshot.
  it('renders with no props', () => {
    const header = renderer.create(<header />);
    expect(header).toMatchSnapshot();
  });
  it('renders when screen size <= 700', () => {
    window.testMediaQueryValues = { width: 500 };
    const header = renderer.create(<header />);
    expect(header).toMatchSnapshot();
  });
  it('renders when screen size > 700', () => {
    window.testMediaQueryValues = { width: 1000 };
    const header = renderer.create(<header />);
    expect(header).toMatchSnapshot();
  });
});
