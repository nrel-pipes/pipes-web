import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import useAuthStore from '../stores/AuthStore';
import "./styles/NavbarTop.css";

const SiteNavbarFluid = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  // Check authentication status when component mounts
  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuthStatus();
      setIsAuthenticated(authStatus);
    };

    verifyAuth();
  }, [checkAuthStatus]);

  return (
    <Navbar expand="lg" className="navbar-instance">
      <Container className="navbar-menu-container d-flex" fluid>
        {/* Left side - PIPES logo and text */}
        <Navbar.Brand href="/" style={{width: isAuthenticated ? 'auto' : '120px'}}>
          <div className="d-flex align-items-center">
            <Image
              src="/images/NREL-PIPES-Logo-IconAcronym-FullColor.png"
              alt="PIPES"
              style={{ width: "80%", maxWidth: "96px" }}
            />
            {/* Always show the text regardless of authentication */}
            <span className="pipes-full-name ms-2">
              - Pipeline for Integrated Projects in Energy Systems
            </span>
          </div>
        </Navbar.Brand>

        {/* Right side - NREL logo fixed to the right */}
        <div className="nrel-logo-container">
          {isAuthenticated ? (
            <Image src="/images/nrel-logo@2x-01.png" alt="NREL" className="fluid-image"/>
          ) : (
            <Nav.Link href="/login" className="login-link">Login</Nav.Link>
          )}
        </div>

        {/* Toggle button for any additional content */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggle-button" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Additional navigation items can go here */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SiteNavbarFluid;
