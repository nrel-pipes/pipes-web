import React from 'react';
import { Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const homeTooltip = (props) => (<Tooltip id="username-tooltip" {...props}>Home</Tooltip>);
  const accountTooltip = (props) => (<Tooltip id="username-tooltip" {...props}>Account</Tooltip>);
  const logoutTooltip = (props) => (<Tooltip id="logout-tooltip" {...props}>Logout</Tooltip>);

  return (
    <Nav className="flex-column bg-light sidebar">
      <Link className="nav-link" to="/">
        <OverlayTrigger placement="right" delay={{ show: 250, hide: 100 }}  overlay={homeTooltip}>
          <i className="bi bi-house-door"></i>
        </OverlayTrigger>
      </Link>
      <Link className="nav-link" to="/account">
        <OverlayTrigger placement="right" delay={{ show: 250, hide: 100 }}  overlay={accountTooltip}>
          <i className="bi bi-person-circle"></i>
        </OverlayTrigger>
      </Link>
      <Link className="nav-link logout-icon" to="/logout">
        <OverlayTrigger placement="right" delay={{ show: 250, hide: 100 }}  overlay={logoutTooltip}>
          <i className="bi bi-box-arrow-right"></i>
        </OverlayTrigger>
      </Link>
    </Nav>
  );
};

export default Sidebar;
