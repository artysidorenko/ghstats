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
    <form onSubmit={handleSubmit}>
      <label className="month">
        Period:
          <select value={month} onChange={handleChangeMonth}>
          {monthsWord.map((elem, index) =>
            <option key={index} value={elem}>
              {elem}
            </option>
          )}
        </select>
        <select value={year.slice(2)} onChange={handleChangeYear}>
          {years.map((elem, index) =>
            <option key={index} value={elem}>
              {elem}
            </option>
          )}
        </select>
      </label>
      <input type="submit" value="Submit" disabled={!keyReceived} />
    </form>
  )

MonthForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChangeMonth: PropTypes.func.isRequired,
  handleChangeYear: PropTypes.func.isRequired,
  keyReceived: PropTypes.bool.isRequired,
  month: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired
}

export default MonthForm