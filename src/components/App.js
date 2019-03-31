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
      token: null
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
      });
    }
    else if (this.props.history.location.hash) this.handleAuthentication(this.props.history)
  }

  handleAuthentication = ({ location }) => {
    if (/access_token|id_token|error/.test(location.hash)) {
      this.props.auth.handleAuthentication(authResult => {
        this.setState({ token: authResult.accessToken })
      })
    }
  }

  render() {
    const { isAuthenticated, getAccessToken, getIdToken } = this.props.auth

    const authCheck = isAuthenticated()

    console.log('token: ' + this.state.token)

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
        <MonthlyNewRepos />
        <Languages />
      </div>
    )
  }
}

export default App
