import { useState } from 'react'

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import "./Navbar.css"


const SiteNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    const userData = {
      username: 'test.user@example.com',
    }
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <Navbar expand="lg" className="navbar-instance">
      <Container className="navbar-menu-container">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/projects">Projects</Nav.Link>
          </Nav>
          {isLoggedIn ? (
          <Nav className="ms-auto">
            <NavDropdown title="Settings" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#web/3.1"> Profile </NavDropdown.Item>
              <NavDropdown.Item href="#web/3.2"> Tokens </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#logout">Logout</Nav.Link>
          </Nav>
          ) : (
          <Nav className="ms-auto">
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SiteNavbar;
