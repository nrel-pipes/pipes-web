import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faKey, faLock } from '@fortawesome/free-solid-svg-icons';

import "./Navbar.css"
import useAuthStore from '../pages/stores/AuthStore';


const SiteNavbar = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <Navbar expand="lg" className="navbar-instance">
      <Container fluid className="navbar-menu-container px-3">
        <Navbar.Brand href="/" className="me-2 p-0">
          <span style={{ 
            fontFamily: 'Roboto, sans-serif', 
            fontWeight: 'bold', 
            fontSize: '1rem',
            letterSpacing: '0.5px'
          }}>
            PIPES
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn ? (
              <>
                <Nav.Link href="/projects" className="fw-bold">Projects</Nav.Link>
                <Nav.Link href="/overview">Overview</Nav.Link>
                <Nav.Link href="/schedule">Schedule</Nav.Link>
                <Nav.Link href="/pipeline">Pipeline</Nav.Link>
              </>
            ) : (
              <Nav.Link href="/" className="ms-2">Home</Nav.Link>
            )}
          </Nav>
          {isLoggedIn ? (
            <Nav className="ms-auto">
              <NavDropdown title={<FontAwesomeIcon icon={faCog} size="lg" />} id="collasible-nav-dropdown">
                <NavDropdown.Item href="/profile"><FontAwesomeIcon icon={faUser} size='sm' />&nbsp;&nbsp; Profile </NavDropdown.Item>
                <NavDropdown.Item href="/tokens"><FontAwesomeIcon icon={faKey} size='sm' />&nbsp;&nbsp;Tokens</NavDropdown.Item>
                <hr style={{marginLeft:"15px", marginRight: "15px"}} />
                <NavDropdown.Item href="/change-password"><FontAwesomeIcon icon={faLock} size='sm' />&nbsp;&nbsp;Change Password </NavDropdown.Item>
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
