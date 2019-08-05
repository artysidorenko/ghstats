import React from "react";
import {
  Col,
  Card,
  CardBody,
  Badge
} from "shards-react";
import PageTitle from "../common/PageTitle";

const firstRow = [
  {
    backgroundImage: "",
    category: "Step 1A",
    categoryTheme: "info",
    title: "Login to enable access to the GitHub API",
    func: "login",
    body:
      "Click the login button in the corner of the screen. This will redirect to Auth0 where you can use your GitHub login details to generate a personalised access token for the GitHub API. Access is strictly read-only and no information is shared or recorded."
  },
  {
    backgroundImage: "",
    category: "Step 1B",
    categoryTheme: "info",
    title: "I don't want to login/don't have credentials!",
    func: "offline",
    body:
      "You can still view an offline example with static data by navigating via the left-hand menu."
  }
];

const secondRow = [
  {
    backgroundImage: "",
    category: "Step 2",
    categoryTheme: "warning",
    title: "Check out the assorted Dashboard",
    func: "dashboard",
    body:
      "This will show a live series of stats which are regularly updated on the state of GitHub repos."
  },
  {
    backgroundImage: "",
    category: "Step 3",
    categoryTheme: "dark",
    title: "Examine monthly new repo trends",
    func: "monthly",
    body:
      "Navigate to 'Monthly Repos' and select a desired period to look at the time series trend for your desired programming language."
  },
  {
    backgroundImage: "",
    category: "Step 4",
    categoryTheme: "success",
    title: "Take a snapshot of relative language popularity",
    func: "treemap",
    body:
      "Go to 'Repo Treemap' and select a point in time for a treemap snapshot of which languages were most popular in that period."
  }
];

const containerClasses = "w-50 d-inline-block p-3";
const cardClasses = "anchor-box";

const TableRow = ({ post, idx, helpers}) => (
  <Col lg="5.5" md="6" sm="12" className={containerClasses} key={idx}>
    <Card small className={cardClasses} onClick={helpers[post.func]}>
      <div className="pl-3 pt-3">
        <Badge pill className={`card-badge bg-${post.categoryTheme}`}>
          {post.category}
        </Badge>
      </div>
      <CardBody>
        <h5 className="card-title">
          <span className="text-fiord-blue">{post.title}</span>
        </h5>
        <p className="card-text d-inline-block mb-3">{post.body}</p>
      </CardBody>
    </Card>
  </Col>
);

const Instructions = ({ helpers }) => (
  <div className="content-height">
    <PageTitle title="Instructions"/>

    {firstRow.map((post, idx) => (
      <TableRow post={post} idx={idx} helpers={helpers} key={idx} />
    ))}
    <br />
    {secondRow.map((post, idx) => (
      <TableRow post={post} idx={idx} helpers={helpers} key={idx} />
    ))}
  </div>
);

export default Instructions