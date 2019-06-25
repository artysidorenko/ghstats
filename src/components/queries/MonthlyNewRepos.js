import React, { Component } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import LineGraph from '../visualisations/LineGraph'
import PeriodForm from '../forms/PeriodForm'
import { NEW_REPOS_QUERY } from '../../utils/queryHelpers'

class NewRepos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromMonth: 'jan',
      fromYear: '10',
      toMonth: 'mar',
      toYear: '19',
      language: 'JavaScript',
      submit: false
    }
  }

  handleChangeFromMonth = (event) => {
    this.setState({ fromMonth: event.target.value })
  }

  handleChangeFromYear = (event) => {
    this.setState({ fromYear: event.target.value })
  }

  handleChangeToMonth = (event) => {
    this.setState({ toMonth: event.target.value })
  }

  handleChangeToYear = (event) => {
    this.setState({ toYear: event.target.value })
  }

  handleChangeLanguage = (event) => {
    this.setState({ language: event.target.value })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.setState({ submit: true })
  }

  render() {
    return (
      <div className="NewRepos__container">
        <PeriodForm
          handleSubmit={this.handleSubmit}
          handleChangeFromMonth={this.handleChangeFromMonth}
          handleChangeFromYear={this.handleChangeFromYear}
          handleChangeToMonth={this.handleChangeToMonth}
          handleChangeToYear={this.handleChangeToYear}
          handleChangeLanguage={this.handleChangeLanguage}
          keyReceived={this.props.keyReceived}
          fromMonth={this.state.fromMonth}
          fromYear={this.state.fromYear}
          toMonth={this.state.toMonth}
          toYear={this.state.toYear}
          language={this.state.language}
        />
        {!this.state.submit && !localStorage.getItem('isLoggedIn') && (
          <h4 className="NewRepos__Message">
            Monthly New Repo Trend: Please login to access visualisations
          </h4>
        )}
        {!this.state.submit && localStorage.getItem('isLoggedIn') && (
          <h4 className="NewRepos__Message">
            Monthly New Repo Trend: Select your request using the dropdowns
          </h4>
        )}
        {this.state.submit && <Query
          query={NEW_REPOS_QUERY(this.state.fromMonth + this.state.fromYear, this.state.toMonth + this.state.toYear, this.state.language, gql)}
        >
          {({ loading, error, data }) => {
            if (loading) return (
              <div className="NewRepos__LoaderBox">
                <div className="loader"></div>
              </div>
            )
            if (error) return <div className="NewRepos__Message">Error, please see below. In the event of a network error you may need to delete local storage/cookies/cache and refresh page to login again<br />
              ${error.toString()}</div>
            console.log(`Operation quota cost: ${data.rateLimit.cost}`)
            console.log(`Quota remaining: ${data.rateLimit.remaining}`)
            console.log(`Reset at: ${data.rateLimit.resetAt}`)
            console.log(Object.entries(data))
            if (Object.entries(data).length > 1) return <LineGraph data={data} />
            return null
          }}
        </Query>}
      </div>
    );
  }
}

export default NewRepos;
