import React, { Component } from 'react'

import MonthlyNewRepos from './queries/MonthlyNewRepos'
import Languages from './queries/Languages'

import '../styles/App.scss'
import '../styles/mobile.scss'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggingIn: false,
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
      // console.log('isLoggedIn = true; attempting to renew session...')
      renewSession(authResult => {
        this.getAPIToken(authResult.idToken, body => {
          this.props.setToken(body)
          this.setState({ keyReceived: true })
        })
      });
    }
    else if (this.props.history.location.hash) {
      this.setState({loggingIn: true})
      // console.log(`App.js props.history.location.hash: ${this.props.history.location.hash}`)
      this.handleAuthentication(this.props.history)
    }
  }

  handleAuthentication = ({ location }) => {
    if (/access_token|id_token|error/.test(location.hash)) {
      this.props.auth.handleAuthentication(authResult => {
        this.getAPIToken(authResult.idToken, body => {
          this.props.setToken(body)
          this.setState({ keyReceived: true, loggingIn: false })
        })
      })
    }
  }

  /**
   * @jwt string: this is the ID token we were sent from auth0 upon authentication
   * @callback: use this callback to pass the API token up to index.js for Apollo-link
   */
  getAPIToken = (jwt, callback) => {
    const request = require("request");
    const options = {
      method: 'GET',
      url: 'https://wt-f1d82d610072deeaf794b2ad8e84524c-0.sandbox.auth0-extend.com/authToken',
      headers: { authorization: `Bearer ${jwt}` },
    };

    request(options, function (error, response, body) {
      if (error) {
        // console.log(`App.js getAPIToken request() error: ${error}`)
        throw new Error(error)
      }
      // console.log('App.js getAPIToken: initiating callback on response body:')
      // console.log(body)
      callback(body)
    });
  }

  render() {
    const { isAuthenticated } = this.props.auth
    const { loggingIn, keyReceived } = this.state
    const authCheck = isAuthenticated()

    return (
      <div className="App__container">
        <h1>GitHub Data Dashboard</h1>
        {!authCheck && !loggingIn && (
            <button
              id="qsLoginBtn"
              className="btn-margin App__loginBtn"
              onClick={this.login.bind(this)}
            >
              Log In With GitHub
            </button>
        )}
        {loggingIn && (
          <p className="loggingIn">Authenticating</p>
        )}
        {authCheck && !loggingIn && (
          <div>
            <span>Logged in successfully</span>
            <button
              id="qsLogoutBtn"
              className="btn-margin App__logoutBtn"
              onClick={this.logout.bind(this)}
            >
              Logout
            </button>
          </div>
        )}
        <h3>Instructions once authorised: for each visualisation, select the desired parameters and click submit to fetch and visualise data</h3>
        <MonthlyNewRepos keyReceived={keyReceived} />
        <Languages keyReceived={keyReceived} />
      </div>
    )
  }
}

export default App
