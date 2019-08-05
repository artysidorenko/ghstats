import React, { Component } from 'react'
import {
  Col,
  Container,
  Row
} from "shards-react"
import { BrowserRouter as Router, Route } from "react-router-dom";

import { Menu, Banner } from './navigation'
import Instructions from './other/Instructions'
import Dashboard from './Dashboard'
import MonthlyNewRepos from "./queries/MonthlyNewRepos"
import Languages from "./queries/Languages"

import '../styles/_global.scss'
import '../styles/mobile.scss'
import "bootstrap/dist/css/bootstrap.min.css"
import "shards-ui/dist/css/shards.min.css"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggingIn: false,
      keyReceived: false,
      highlightLogin: false,
      highlightOffline: false,
      highlightDashboard: false,
      highlightMonthly: false,
      highlightTreemap: false
    };
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  componentDidMount() {
    const { renewSession } = this.props.auth;
    if (localStorage.getItem("isLoggedIn") === "true") {
      // console.log('isLoggedIn = true; attempting to renew session...')
      renewSession(authResult => {
        this.getAPIToken(authResult.idToken, body => {
          this.props.setToken(body);
          this.setState({ keyReceived: true });
        });
      });
    } else if (this.props.history.location.hash) {
      this.setState({ loggingIn: true });
      console.log(
        `App.js props.history.location.hash: ${
          this.props.history.location.hash
        }`
      );
      this.handleAuthentication(this.props.history);
    }
  }

  handleAuthentication = ({ location }) => {
    if (/access_token|id_token|error/.test(location.hash)) {
      this.props.auth.handleAuthentication(authResult => {
        this.getAPIToken(authResult.idToken, body => {
          this.props.setToken(body);
          this.setState({ keyReceived: true, loggingIn: false });
        });
      });
    }
  };

  /**
   * @jwt string: this is the ID token we were sent from auth0 upon authentication
   * @callback: use this callback to pass the API token up to index.js for Apollo-link
   */
  getAPIToken = (jwt, callback) => {
    const request = require("request");
    const options = {
      method: "GET",
      url:
        "https://wt-f1d82d610072deeaf794b2ad8e84524c-0.sandbox.auth0-extend.com/authToken",
      headers: { authorization: `Bearer ${jwt}` }
    };

    request(options, function(error, response, body) {
      if (error) {
        // console.log(`App.js getAPIToken request() error: ${error}`)
        throw new Error(error);
      }
      // console.log('App.js getAPIToken: initiating callback on response body:')
      // console.log(body)
      callback(body);
    });
  };

  updateInstructionState = (login, offline, dashboard, monthly, treemap) => {
    this.setState({
      highlightLogin: login,
      highlightOffline: offline,
      highlightDashboard: dashboard,
      highlightMonthly: monthly,
      highlightTreemap: treemap
    });
  }

  resetInstructionState = () => {
    console.log('test2')
    this.updateInstructionState(false, false, false, false, false)
  }

  instructionHelpers = {
    login: () => {console.log('test') ;this.updateInstructionState(!this.state.highlightLogin, false, false, false, false)},
    offline: () => {this.updateInstructionState(false, !this.state.highlightOffline, false, false, false)},
    dashboard: () => {this.updateInstructionState(false, false, !this.state.highlightDashboard, false, false)},
    monthly: () => {this.updateInstructionState(false, false, false, !this.state.highlightMonthly, false)},
    treemap: () => {this.updateInstructionState(false, false, false, false, !this.state.highlightTreemap)}
  };

  render() {
    const { isAuthenticated } = this.props.auth;
    const { loggingIn, keyReceived } = this.state;
    const authCheck = isAuthenticated();
    const highlights = {
      login: this.state.highlightLogin,
      offline: this.state.highlightOffline,
      dashboard: this.state.highlightDashboard,
      monthly: this.state.highlightMonthly,
      treemap: this.state.highlightTreemap,
    };

    return (
      <Router>
        <Container fluid={true} className="px-0 h-100vh">
          <Row className="no-gutters h-100vh">
            <Menu highlights={highlights} handleClick={this.resetInstructionState}/>

            <Col className="main col-auto w-100">
              <Banner
                authCheck={authCheck}
                loggingIn={loggingIn}
                login={this.login.bind(this)}
                logout={this.logout.bind(this)}
                highlights={highlights}
                handleClick={this.resetInstructionState}
              />
              <Container fluid={true} className="p-3 content-height">
                <Route
                  path="/instructions"
                  render={() => (
                    <Instructions helpers={this.instructionHelpers} />
                  )}
                />
                <Route
                  path="/dashboard"
                  render={() => 'test'}
                />
                <Route
                  path="/monthlyrepos"
                  render={() => <MonthlyNewRepos keyReceived={keyReceived}/>}
                />
                <Route
                  path="/treemap"
                  render={() => <Languages keyReceived={keyReceived}/>}
                />
              </Container>
            </Col>
          </Row>
        </Container>
      </Router>
    );
  }
}

export default App
