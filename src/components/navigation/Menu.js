import React from "react";
import {
  Col,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink
} from "shards-react"
import { NavLink as RouteNavLink, withRouter } from "react-router-dom";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks, faWifi, faTachometerAlt, faChartLine, faChartPie, faSlash } from "@fortawesome/free-solid-svg-icons";

import "../../styles/_navigation.scss";

const links = [
  { title: "Instructions", to: "/instructions", icon: faTasks },
  { title: "Offline Example", to: "/example", icon: faWifi },
  { title: "Dashboard", to: "/dashboard", icon: faTachometerAlt },
  { title: "Monthly Repos", to: "/monthlyrepos", icon: faChartLine },
  { title: "Repo Treemap", to: "/treemap", icon: faChartPie }
];

const conditionalClasses = (link, highlights) => classNames(
  "my-2",
  (link.title.includes('Offline') && highlights.offline === true) && "highlight",
  (link.title.includes('Dashboard') && highlights.dashboard === true) && "highlight",
  (link.title.includes('Monthly') && highlights.monthly === true) && "highlight",
  (link.title.includes('Treemap') && highlights.treemap === true) && "highlight",
);

const NavItems = withRouter(({highlights, location}) => {
  return links.map(link => {
    const conditionalClass = conditionalClasses(link, highlights)  // logic for highlighting instructions
    return (
      <NavItem key={link.title} className={location.pathname === link.to ? "selected" : ""}>
        <NavLink to={link.to} tag={RouteNavLink} className={conditionalClass}>

          {/* CONDITIONAL INCLUDES */}
          {link.title.includes("Offline") && (
            <FontAwesomeIcon
              className="mx-2 nav-icon position-absolute offset-y-125em"
              icon={faSlash}
            />
          )}

          {/* END OF CONDITIONAL INCLUDES */}
          <FontAwesomeIcon className="mx-2 nav-icon" icon={link.icon} />
          {link.title}
        </NavLink>
      </NavItem>
    );});
})

const Menu = ({ highlights, handleClick }) => (
  <Col tag="aside" className="sidebar col-auto border-right" onClick={handleClick}>
    <Navbar
      className="align-items-stretch bg-white flex-md-nowrap border-bottom p-4"
      type="light"
    >
      <NavbarBrand href="#">
        <img src="./favicon.png" className="ml-4 mr-2" alt="GitStats Logo" />
        <span>GitStats</span>
      </NavbarBrand>
    </Navbar>
    <Nav className="nav--no-borders flex-column mt-3">
      <NavItems highlights={highlights} />
    </Nav>
  </Col>
);

export default Menu