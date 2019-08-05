import React, { Fragment } from "react";

import MonthlyNewRepos from "./queries/MonthlyNewRepos";
import Languages from "./queries/Languages";

const Dashboard = ({ keyReceived }) => (
  <Fragment>
    <MonthlyNewRepos keyReceived={keyReceived} />
    <Languages keyReceived={keyReceived} />
  </Fragment>
);

export default Dashboard