import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import useAuthStore from '../pages/stores/AuthStore';
import "./Navbar.css";


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
            {/* Projects link removed */}
          </Nav>
          {isLoggedIn ? (
          <Nav className="ms-auto">
            <Image src="./images/nrel-logo@2x-01.png" alt="NREL" className="fluid-image"/>
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

export default SiteNavbarFluid;
