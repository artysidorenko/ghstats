import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import '../styles/App.css';
// import Data from './Data'
import NewRepos from './NewRepos'

const FEED_QUERY = gql`
  query {
    viewer {
      name
    }
  }
`

class App extends Component {
  render() {
    return (
      <div className="App__container">
        <Query
          query={FEED_QUERY}
        >
          {({ loading, error, data }) => {
            if (loading) return <span>Loading</span>
            if (error) return <div>Error, please see below. <br />
              ${error.toString()}</div>
            return (
              <Fragment>
                {data.viewer.name}
              </Fragment>
            )
          }}
        </Query>
        <NewRepos />
        {/* <Data /> */}
      </div>
    );
  }
}

export default App;
