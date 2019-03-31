import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import '../styles/App.css'
import MonthlyNewRepos from './queries/MonthlyNewRepos'
import Languages from './queries/Languages';

const queryAuth0API = (token, callback) => {
  const request = require("request");

  const options = {
    method: 'GET',
    url: `https://dev-8-2xd3l4.eu.auth0.com/api/v2/users`,
    headers: { authorization: `Bearer ${token}` }
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error)
    const responseArray = JSON.parse(body)
    const githubToken = responseArray.find(e1 => e1.identities.some(e2 => e2.provider === 'github'))
                                       .identities
                                       .find(e2 => e2.provider === 'github')
                                       .access_token
    callback(githubToken)
  });

}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      githubAccess: null
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
        this.setState({ token: authResult.accessToken })
        this.getAuth0APIAccess(githubToken => {
          this.setState({ githubAccess: githubToken })
          this.props.setToken(githubToken)
          console.log(authResult.idToken)
        })
      });
    }
    else if (this.props.history.location.hash) this.handleAuthentication(this.props.history)
  }

  handleAuthentication = ({ location }) => {
    if (/access_token|id_token|error/.test(location.hash)) {
      this.props.auth.handleAuthentication(authResult => {
        this.setState({ token: authResult.accessToken })
        console.log(authResult.idToken)
        this.getAuth0APIAccess(githubToken => {
          this.setState({ githubAccess: githubToken })
          this.props.setToken(githubToken)
        })
      })
    }
  }

  getAuth0APIAccess = (callback) => {
    const request = require("request");
    const options = {
      method: 'POST',
      url: 'https://dev-8-2xd3l4.eu.auth0.com/oauth/token',
      headers: { 'content-type': 'application/json' },
      body: '{"client_id":"qdYnARIkxXPhghdw0EzOUP7CSnFMKj30","client_secret":"5zhOaRolUtd9I31gZhVNjYtLBtF-ijWOI4U9L0akgeKnVScimLhK6qPV3lkSawKG","audience":"https://dev-8-2xd3l4.eu.auth0.com/api/v2/","grant_type":"client_credentials"}'
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      const token = JSON.parse(body).access_token
      queryAuth0API(token, githubToken => {
        callback(githubToken)
      })
    });
  }

  render() {
    const { isAuthenticated } = this.props.auth
    const { githubAccess } = this.state
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
        <MonthlyNewRepos token={githubAccess} />
        <Languages token={githubAccess} />
      </div>
    )
  }
}

export default App
