import React, { Component } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import TreeMap from '../visualisations/TreeMap'
import {monthsWord, years, monthsDigit, LANGUAGE_REPOS_QUERY} from '../../utils/queryHelpers'
import MonthForm from '../forms/MonthForm'

class Languages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: 'jan',
      year: '2010',
      submit: false
    }
  }

  handleChangeMonth = (event) => {
    this.setState({ month: event.target.value })
  }

  handleChangeYear = (event) => {
    this.setState({ year: `20${event.target.value}` })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.setState({ submit: true })
  }

  render() {
    return (
      <div className="Languages__container">
        <MonthForm
          handleSubmit={this.handleSubmit}
          handleChangeMonth={this.handleChangeMonth}
          handleChangeYear={this.handleChangeYear}
          keyReceived={this.props.keyReceived}
          month={this.state.month}
          year={this.state.year}
        />
        {!this.state.submit && !localStorage.getItem('isLoggedIn') && (
          <h4 className="Languages__Message">
            Point-in-time View of Relative Language Popularity: Please login to access visualisations
          </h4>
        )}
        {!this.state.submit && localStorage.getItem('isLoggedIn') && (
          <h4 className="Languages__Message">
            Point-in-time View of Relative Language Popularity: Select your request using the dropdowns
          </h4>
        )}
        {this.state.submit && <Query
          query={LANGUAGE_REPOS_QUERY(`${this.state.year}-${monthsDigit[monthsWord.indexOf(this.state.month)]}`, gql)}
        >
          {({ loading, error, data }) => {
            if (loading) return (
              <div className="Languages__LoaderBox">
                <div className="loader"></div>
              </div>
            )
            if (error) return <div className="Languages__Message">Error, please see below. <br />
              ${error.toString()}
              </div>
            console.log(`Operation quota cost: ${data.rateLimit.cost}`)
            console.log(`Quota remaining: ${data.rateLimit.remaining}`)
            console.log(`Reset at: ${data.rateLimit.resetAt}`)
            console.log(Object.entries(data))
            if (Object.entries(data).length > 1) return <TreeMap data={data} />
            return null
          }}
        </Query>}
      </div>
    );
  }
}

export default Languages;