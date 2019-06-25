import React from 'react'
import PropTypes from 'prop-types'
import { monthsWord, years } from '../../utils/queryHelpers'

const PeriodForm = ({
  handleSubmit,
  handleChangeFromMonth,
  handleChangeFromYear,
  handleChangeToMonth,
  handleChangeToYear,
  handleChangeLanguage,
  keyReceived,
  fromMonth,
  fromYear,
  toMonth,
  toYear,
  language
}) => (
  <form onSubmit={handleSubmit}>
    <div className="from">
      From:
          <select value={fromMonth} onChange={handleChangeFromMonth}>
        {monthsWord.map((elem, index) =>
          <option key={`fromMonth-${index}`} value={elem}>
            {elem}
          </option>
        )}
      </select>
      <select value={fromYear} onChange={handleChangeFromYear}>
        {years.map((elem, index) =>
          <option key={`fromYear-${index}`} value={elem}>
            {elem}
          </option>
        )}
      </select>
    </div>
      <div className="to">
      To:
          <select value={toMonth} onChange={handleChangeToMonth}>
        {monthsWord.map((elem, index) =>
          <option key={`toMonth-${index}`} value={elem}>
            {elem}
          </option>
        )}
      </select>
      <select value={toYear} onChange={handleChangeToYear}>
        {years.map((elem, index) =>
          <option key={`toYear-${index}`} value={elem}>
            {elem}
          </option>
        )}
      </select>
    </div>
    <div className="language">
      Language:
          <input placeholder="Enter desired language" value={language} onChange={handleChangeLanguage} />
    </div>
    <input type="submit" value="Submit" disabled={!keyReceived} />
  </form>
)

PeriodForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChangeFromMonth: PropTypes.func.isRequired,
  handleChangeFromYear: PropTypes.func.isRequired,
  handleChangeToMonth: PropTypes.func.isRequired,
  handleChangeToYear: PropTypes.func.isRequired,
  handleChangeLanguage: PropTypes.func.isRequired,
  keyReceived: PropTypes.bool.isRequired,
  fromMonth: PropTypes.string.isRequired,
  fromYear: PropTypes.string.isRequired,
  toMonth: PropTypes.string.isRequired,
  toYear: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired
}

export default PeriodForm