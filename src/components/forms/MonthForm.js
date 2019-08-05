import React from 'react'
import PropTypes from 'prop-types'
import { monthsWord, years } from '../../utils/queryHelpers'

const MonthForm = ({
  handleSubmit,
  handleChangeMonth,
  handleChangeYear,
  keyReceived,
  month,
  year
}) => (
  <form class="form-inline" onSubmit={handleSubmit}>
    <div className="mx-auto py-2 w-100 text-center font-weight-bold2 border-bottom d-flex justify-content-between">
      <div class="form-group">
        <span className="mx-2">Period:</span>
        <select
          className="custom-select"
          value={month}
          onChange={handleChangeMonth}
        >
          {monthsWord.map((elem, index) => (
            <option key={`month-${index}`} value={elem}>
              {`${elem[0].toUpperCase()}${elem.slice(1)}`}
            </option>
          ))}
        </select>
        <select
          className="custom-select"
          value={year.slice(2)}
          onChange={handleChangeYear}
        >
          {years.map((elem, index) => (
            <option key={`year-${index}`} value={elem}>
              {`'${elem}`}
            </option>
          ))}
        </select>
      </div>
      <input
        className="mx-2 btn btn-light border"
        type="submit"
        value="Submit"
        disabled={!keyReceived}
      />
    </div>
  </form>
);

MonthForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChangeMonth: PropTypes.func.isRequired,
  handleChangeYear: PropTypes.func.isRequired,
  keyReceived: PropTypes.bool.isRequired,
  month: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired
}

export default MonthForm