import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import '../styles/App.css'
import MonthlyNewRepos from './queries/MonthlyNewRepos'
import Languages from './queries/Languages';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyReceived: false
    }
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  componentDidMount() {
    const { renewSession } = this.props.auth;
    if (localStorage.getItem('isLoggedIn') === 'true') {
      renewSession(authResult => {
        this.getAPIToken(authResult.idToken, body => {
          this.props.setToken(body)
          this.setState({ keyReceived: true })
        })
      });
    }
    else if (this.props.history.location.hash) this.handleAuthentication(this.props.history)
  }

  handleAuthentication = ({ location }) => {
    if (/access_token|id_token|error/.test(location.hash)) {
      this.props.auth.handleAuthentication(authResult => {
        this.getAPIToken(authResult.idToken, body => {
          this.props.setToken(body)
          this.setState({ keyReceived: true })
        })
      })
    }
  }

  getAPIToken = (jwt, callback) => {
    const request = require("request");
    const options = {
      method: 'GET',
      url: 'https://wt-f1d82d610072deeaf794b2ad8e84524c-0.sandbox.auth0-extend.com/authToken',
      headers: { authorization: `Bearer ${jwt}` },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body)
      callback(body)
    });
  }

  render() {
    const { isAuthenticated } = this.props.auth
    const authCheck = isAuthenticated()

    return (
      <div className="App__container">
        <h1>GitHub Data Dashboard</h1>
        {!authCheck && (
            <button
              id="qsLoginBtn"
              className="btn-margin"
              onClick={this.login.bind(this)}
            >
              Log In To Use The GitHub API
                  </button>
        )}
        {authCheck && <h2>Logged in!</h2>}
        <h3>Instructions once authorised: for each visualisation, select the desired parameters and click submit to fetch and visualise data</h3>
        <MonthlyNewRepos keyReceived={this.state.keyReceived} />
        <Languages keyReceived={this.state.keyReceived} />
      </div>
    )
  }
}

export default App
