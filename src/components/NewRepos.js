import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import LineGraph from './LineGraph'

class NewRepos extends Component {
  render() {
    return (
      <div className="NewRepos__container">
        <Query
          query={NEW_REPOS_QUERY}
        >
          {({ loading, error, data }) => {
            if (loading) return <span>Loading</span>
            if (error) return <div>Error, please see below. <br />
              ${error.toString()}</div>
            console.log(`Operation quota cost: ${data.rateLimit.cost}`)
            console.log(`Quota remaining: ${data.rateLimit.remaining}`)
            console.log(`Reset at: ${data.rateLimit.resetAt}`)
            return (
              <Fragment>
                {Object.entries(data).map(([key, value], index) => 
                  <div key={key}>
                    {key}: {value.repositoryCount}
                  </div>
                )}
                <LineGraph data={data} />
              </Fragment>
            )
          }}
        </Query>
      </div>
    );
  }
}

const NEW_REPOS_QUERY = gql`
  query {
  rateLimit {
    cost
    remaining
    resetAt
  
  }
  sep18: search (
    type: REPOSITORY
    query: "created:2018-09-01..2018-09-30 language:Javascript"
  ) {
    repositoryCount
  }
  oct18: search (
    type: REPOSITORY
    query: "created:2018-10-01..2018-10-31 language:Javascript"
  ) {
    repositoryCount
  }
  nov18: search (
    type: REPOSITORY
    query: "created:2018-11-01..2018-11-30 language:Javascript"
  ) {
    repositoryCount
  }
  dec18: search (
    type: REPOSITORY
    query: "created:2018-12-01..2018-12-31 language:Javascript"
  ) {
    repositoryCount
  }
  jan19: search (
    type: REPOSITORY
    query: "created:2019-01-01..2019-01-31 language:Javascript"
  ) {
    repositoryCount
  }
  feb19: search (
    type: REPOSITORY
    query: "created:2019-02-01..2019-02-28 language:Javascript"
  ) {
    repositoryCount
  }
}
`

export default NewRepos;
