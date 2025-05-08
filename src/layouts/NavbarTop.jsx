import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import useAuthStore from '../stores/AuthStore';
import "./styles/NavbarTop.css";

const SiteNavbar = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await checkAuthStatus();
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [checkAuthStatus]);

  return (
    <Navbar expand="lg" className="navbar-instance">
      <Container className="navbar-menu-container">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/projects">Get Started</Nav.Link>
          </Nav>
          {isAuthenticated ? (
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
