import React, { Fragment } from "react";
import {
  Container,
  Navbar,
  Button
} from "shards-react";


const Banner = ({ authCheck, loggingIn, login, logout, highlights, handleClick }) => (
  <Fragment>
    <Container fluid={true} className="p-0 m-0">
      <Navbar type="light" className="border-bottom d-flex">
        <div>
          <span>
            A Live Visualisation Dashboard for{" "}
            <a target="_blank" href="https://github.com" rel="noopener noreferrer">
              GitHub{" "}
            </a>Statistics
          </span>
        </div>
        <div className={highlights.login ? "ml-auto highlight" : "ml-auto"} onClick={handleClick}>
          {!authCheck && !loggingIn && (
            <Button
              id="qsLoginBtn"
              className="h-50 my-auto"
              theme="primary"
              onClick={login}
            >
              Log In With GitHub
            </Button>
          )}

          {loggingIn && <p className="logging-in my-auto">Authenticating</p>}

          {authCheck && !loggingIn && (
            <div>
              <span className="pr-3">Logged in successfully</span>
              <Button
                id="qsLogoutBtn"
                className=""
                theme="primary"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </Navbar>
    </Container>
  </Fragment>
);

export default Banner