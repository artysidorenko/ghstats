import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const FEED_QUERY = gql`
  query {
    user(login: "artysidorenko") {
      repositories (first: 100) {
        nodes {
          name
          createdAt
          pushedAt
          updatedAt
          diskUsage
          languages (first: 100) {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`

class Data extends Component {
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
            console.log(data)
            const repositories = data.user.repositories.nodes
            return (
              <Fragment>
                {repositories.map((repo, index) => 
                  <div
                    key={index}
                  >
                  {repo.languages.nodes.map((language, index) =>
                    <div
                      key={index}
                    >{repo.name} + {language.name}</div>
                  )}
                  </div>
                )}
              </Fragment>
            )
          }}
        </Query>
      </div>
    );
  }
}

export default Data;