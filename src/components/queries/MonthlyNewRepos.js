import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import LineGraph from '../visualisations/LineGraph'

// https://help.github.com/en/articles/searching-for-repositories

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
        <form onSubmit={this.handleSubmit}>
          <label>
            From:
          <select value={this.state.fromMonth} onChange={this.handleChangeFromMonth}>
            {monthsWord.map((elem, index) =>
              <option key={index} value={elem}>
                {elem}
              </option>
            )}
          </select>
            <select value={this.state.fromYear} onChange={this.handleChangeFromYear}>
            {years.map((elem, index) =>
              <option key={index} value={elem}>
                {elem}
              </option>
            )}
          </select>
          </label>
          <label>
            To:
          <select value={this.state.toMonth} onChange={this.handleChangeToMonth}>
              {monthsWord.map((elem, index) =>
                <option key={index} value={elem}>
                  {elem}
                </option>
              )}
            </select>
            <select value={this.state.toYear} onChange={this.handleChangeToYear}>
              {years.map((elem, index) =>
                <option key={index} value={elem}>
                  {elem}
                </option>
              )}
            </select>
          </label>
          <label>
            Language:
          <input placeholder="Enter desired language" value={this.state.language} onChange={this.handleChangeLanguage}/>
          </label>
          <input type="submit" value="Submit" disabled={!this.props.keyReceived}/>
        </form>
        {this.state.submit && <Query
          query={NEW_REPOS_QUERY(this.state.fromMonth + this.state.fromYear, this.state.toMonth + this.state.toYear, this.state.language)}
        >
          {({ loading, error, data }) => {
            if (loading) return <span>Loading</span>
            if (error) return <div>Error, please see below. <br />
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

const NEW_REPOS_QUERY = (from, to, language) => gql`
  query {
  rateLimit {
    cost
    remaining
    resetAt
  
  }
  ${generateMonths(from, to, language)}
}
`
const generateMonths = (from, to, language) => {
  let output = ``
  let current = from
  let limit = 0
  while (current !== to && limit < 120) {
    // add node to GQL query
    output += `${addMonthNode(current.slice(0, 3), `20${current.slice(3)}`, language)}`
    // increment year if required
    if (current.slice(0, 3) === 'dec') {
      current = `jan${parseInt(current.slice(3))+1}`
    }
    // otherwise increment month
    else {
      current = `${monthsWord[monthsWord.indexOf(current.slice(0, 3)) + 1]}${current.slice(3)}`
    }
    limit ++
  }
  return output
}

const addMonthNode = (month, year, language) =>
`
${month}${year.slice(2)}: search (
    type: REPOSITORY
    query: "created:${year}-${monthsDigit[monthsWord.indexOf(month)]} language:${language}"
  ) {
    repositoryCount
  } 
`

export default NewRepos;
