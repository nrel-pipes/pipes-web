import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faKey } from '@fortawesome/free-solid-svg-icons';

import "./Navbar.css"
import useAuthStore from '../pages/stores/authStore';


const SiteNavbar = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

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
            <NavDropdown title={<FontAwesomeIcon icon={faCog} size="lg" />} id="collasible-nav-dropdown">
              <NavDropdown.Item href="/tokens"><FontAwesomeIcon icon={faKey} size='sm' />&nbsp;&nbsp;Tokens</NavDropdown.Item>
              <NavDropdown.Item href="/profile"><FontAwesomeIcon icon={faUser} size='sm' />&nbsp;&nbsp;User Profile </NavDropdown.Item>
            </NavDropdown>
            <div className="divider"></div>
            <Nav.Link href="/logout">Logout</Nav.Link>
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
