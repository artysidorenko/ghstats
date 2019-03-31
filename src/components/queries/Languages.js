import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import TreeMap from '../visualisations/TreeMap'

// https://help.github.com/en/articles/searching-for-repositories

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
        <form onSubmit={this.handleSubmit}>
          <label>
            Period:
          <select value={this.state.month} onChange={this.handleChangeMonth}>
              {monthsWord.map((elem, index) =>
                <option key={index} value={elem}>
                  {elem}
                </option>
              )}
            </select>
            <select value={this.state.year.slice(2)} onChange={this.handleChangeYear}>
              {years.map((elem, index) =>
                <option key={index} value={elem}>
                  {elem}
                </option>
              )}
            </select>
          </label>
          <input type="submit" value="Submit" />
        </form>
        {this.state.submit && <Query
          query={LANGUAGE_REPOS_QUERY(`${this.state.year}-${monthsDigit[monthsWord.indexOf(this.state.month)]}`)}
        >
          {({ loading, error, data }) => {
            if (loading) return <span>Loading</span>
            if (error) return <div>Error, please see below. <br />
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

const monthsWord = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec'
]

const years = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
]

const monthsDigit = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12'
]

const languages = ['Javascript', 'Java', 'Python', 'CSS', 'PHP', 'Ruby', 'C++', 'C', 'Shell', 'C#', 'HTML', 'Go', 'Typescript',
'Swift', 'Scala'
]

// period in format YYYY-MM
const LANGUAGE_REPOS_QUERY = (period) => gql`
  query {
  rateLimit {
    cost
    remaining
    resetAt
  }
  ALL: search (
    type: REPOSITORY
    query: "created:${period}"
  ) {
    repositoryCount
  }
  ${languages.reduce((total, elem) => total + addLanguageNode(elem, period), '')}
  }
`

const addLanguageNode = (language, period) => `
${language.replace('++', 'plusplus').replace('#', 'sharp')}: search (
    type: REPOSITORY
    query: "created:${period} language:${language}"
  ) {
    repositoryCount
  }
`

export default Languages;