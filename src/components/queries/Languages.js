import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";

import TreeMap from '../visualisations/TreeMap'
import {monthsWord, years, monthsDigit, LANGUAGE_REPOS_QUERY} from '../../utils/queryHelpers'
import MonthForm from '../forms/MonthForm'
import PageTitle from '../common/PageTitle';

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
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const { submit, year, month } = this.state
    return (
      <Fragment>
        <Row noGutters className="py-4 px-3">
          <PageTitle title="Repository Treemap" />
        </Row>
        <Row>
          <Col>
            <Card className="m-auto hmin-60vh border rounded">
              <MonthForm
                handleSubmit={this.handleSubmit}
                handleChangeMonth={this.handleChangeMonth}
                handleChangeYear={this.handleChangeYear}
                keyReceived={this.props.keyReceived}
                month={month}
                year={year}
              />
              {!submit && (
                <h4 className="Languages__Message">
                  {isLoggedIn
                    ? "Point-in-time View of Relative Language Popularity: Select your request using the dropdowns"
                    : "Point-in-time View of Relative Language Popularity: Please login to access visualisations"}
                </h4>
              )}
              {submit && <GraphQLQuery year={year} month={month} />}
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

const GraphQLQuery = ({ year, month }) => (
  <Query
    query={LANGUAGE_REPOS_QUERY(`${year}-${monthsDigit[monthsWord.indexOf(month)]}`, gql)}
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
  </Query>
)

export default Languages;