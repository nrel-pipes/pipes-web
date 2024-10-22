import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faKey, faLock } from '@fortawesome/free-solid-svg-icons';

import "./Navbar.css"
import useAuthStore from '../pages/stores/AuthStore';


const SiteNavbarFluid = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <Navbar expand="lg" className="navbar-instance">
      <Container className="navbar-menu-container" fluid>
        <Navbar.Brand href="/" style={{width: '120px'}}>
          <Image
            src="/images/NREL-PIPES-Logo-IconAcronym-FullColor.png"
            alt="PIPES"
            style={{ width: "80%" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link href="/projects">Projects</Nav.Link>
            {isLoggedIn ? (
            <Nav className="ms-auto">
              <div className="divider"></div>
              <Nav.Link href="/overview">Overview</Nav.Link>
              <Nav.Link href="/schedule">Schedule</Nav.Link>
              <Nav.Link href="/pipeline">Pipeline</Nav.Link>
            </Nav>
            ) : ("")}
          </Nav>
          {isLoggedIn ? (
          <Nav className="ms-auto">
            <NavDropdown title={<FontAwesomeIcon icon={faCog} size="lg" />} id="collasible-nav-dropdown">
              <NavDropdown.Item href="/profile" className='py-2'><FontAwesomeIcon icon={faUser} size='sm' />&nbsp;&nbsp; Profile </NavDropdown.Item>
              <NavDropdown.Item href="/tokens" className='py-2'><FontAwesomeIcon icon={faKey} size='sm' />&nbsp;&nbsp;Tokens</NavDropdown.Item>
              <hr style={{marginLeft:"15px", marginRight: "15px"}} />
              <NavDropdown.Item href="/change-password"><FontAwesomeIcon icon={faLock} size='sm' />&nbsp;&nbsp;Change Password </NavDropdown.Item>
            </NavDropdown>
            <div className="divider"></div>
            <Nav.Link href="/logout">Logout &nbsp;&nbsp;</Nav.Link>
          </Nav>
          ) : (
          <Nav className="ms-auto">
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
          )}
          <Image src="./images/nrel-logo@2x-01.png" alt="NREL" className="fluid-image"/>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SiteNavbarFluid;
