import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActions,
  CardContent,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import MetaMaskChip from '../common/MetaMaskChip';

// Import gql Query
import { LOGIN_USER_OR_STREAMER } from '../../graphql/Login';

import '../common/styles.css';
import './styles.css';

const styles = theme => ({
  card: {
    maxWidth: 300
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  input: {
    margin: theme.spacing.unit,
    minWidth: 150
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 180
  },
  buttonContainer: {
    marginTop: 0,
    margin: theme.spacing.unit,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      publicAddress: '',
      isStreamer: false,
      errors: {}
    };
  }

  handleLogin = async () => {
    // Declare Variables
    const { email, password, isStreamer } = this.state;

    // Make request and retrieve response
    const response = await this.props.mutate({
      variables: { email, password, isStreamer }
    });

    console.log(`${email}, ${password}, ${isStreamer}`);

    // Declare Response Variables
    const { ok, token, refreshToken, errors } = response.data.login;

    console.log(response);

    // Set Token if Successful login
    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      const pathname = isStreamer ? '/streamer-dashboard' : 'viewer-dashboard';

      // Redirect User to Home once logged in
      this.props.history.push({
        pathname
      });
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });

      // Set state
      this.setState({ errors: err });
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleStreamerCheckbox = event => {
    this.setState({ [event.target.name]: !this.state.isStreamer });
  };

  handleRegisterRoute = () => {
    this.props.history.push({
      pathname: '/register'
    });
  };

  render() {
    const { classes } = this.props;
    const {
      email,
      password,
      isStreamer,
      errors: { passwordError, emailError }
    } = this.state;

    return (
      <div className="login-grid-container app">
        <div className="login-metamask">
          <MetaMaskChip />
        </div>
        <div className="login-header">
          <button className="btn-secondary" onClick={this.handleRegisterRoute}>
            Register
          </button>
        </div>
        <div className="login-main">
          <Card className={classes.card} elevation={4}>
            <CardContent>
              <div className={classes.container}>
                <div className={classes.margin}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      className={classes.input}
                      name="email"
                      value={email}
                      onChange={this.handleChange}
                      label="Email"
                      placeholder="Enter Email"
                      required={true}
                      helperText={emailError}
                      error={emailError ? true : false}
                    />
                    <TextField
                      className={classes.input}
                      name="password"
                      value={password}
                      onChange={this.handleChange}
                      label="Password"
                      placeholder="Enter Password"
                      type="password"
                      required={true}
                      helperText={passwordError}
                      error={passwordError ? true : false}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="isStreamer"
                          checked={isStreamer}
                          onChange={this.handleStreamerCheckbox}
                        />
                      }
                      label="Login as Streamer"
                    />
                  </FormControl>
                </div>
              </div>
            </CardContent>
            <CardActions className={classes.buttonContainer}>
              <button className="btn-primary" onClick={this.handleLogin}>
                Login
              </button>
            </CardActions>
          </Card>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default graphql(LOGIN_USER_OR_STREAMER)(withStyles(styles)(Login));
