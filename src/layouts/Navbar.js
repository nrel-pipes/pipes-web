import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";


import useAuthStore from '../pages/stores/AuthStore';
import "./Navbar.css";


const SiteNavbar = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <Navbar expand="lg" className="navbar-instance">
      <Container className="navbar-menu-container">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/projects">Get Started</Nav.Link>
          </Nav>
          {isLoggedIn ? (
          <Nav className="ms-auto">
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
