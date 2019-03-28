import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import '../styles/App.css'
import MonthlyNewRepos from './queries/MonthlyNewRepos'
import Languages from './queries/Languages';

class App extends Component {
  render() {
    return (
      <div className="App__container">
        <h1>GitHub Data Dashboard</h1>
        <h2>Instructions: for each visualisation, select the desired parameters and click submit to fetch and visualise data</h2>
        <MonthlyNewRepos />
        <Languages />
      </div>
    );
  }
}

export default App;
