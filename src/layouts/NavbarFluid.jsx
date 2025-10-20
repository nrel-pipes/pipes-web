import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import { FaBook, FaBriefcase, FaHome, FaSignOutAlt, FaUser } from 'react-icons/fa';

import { useNavigation } from '../contexts/NavigationContext';
import useAuthStore from '../stores/AuthStore';
import "./styles/NavbarTop.css";

const SiteNavbarFluid = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const { setActiveSection } = useNavigation();

  // Check authentication status when component mounts
  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuthStatus();
      setIsAuthenticated(authStatus);
    };

    verifyAuth();
  }, [checkAuthStatus]);

  const handleNavClick = (section, e) => {
    e.preventDefault();
    setActiveSection(section);
    // Navigate programmatically after setting context
    window.location.href = e.currentTarget.getAttribute('href');
  };

  return (
    <>
      <Container fluid className="banner" style={{ height: "100px" }}>
      <Row>
        <Col className="d-flex justify-content-between align-items-center" xs={6} style={{ height: "100px" }}>
          <a href="/" className="d-flex align-items-center" style={{ textDecoration: "none" }}>
            <Image
              className="rounded"
              src="/images/NREL-PIPES-Logo-IconAcronym-FullColor.png"
              alt="PIPES"
              style={{ maxHeight: "100px" }}
              fluid
            />
            <span className="pipes-full-name ms-2" style={{ fontSize: '1.75rem', color: '#000' }}>
              - Pipeline for Integrated Projects in Energy Systems
            </span>
          </a>
        </Col>
        <Col className="d-flex justify-content-end" xs={6} style={{ height: "100px" }}>
          <Image
            className="banner-nrel-image"
            src="/images/nrel-logo@2x-01.png"
            alt="NREL"
            style={{ maxHeight: "100px" }}
            fluid
          />
        </Col>
      </Row>
    </Container>

    <Navbar expand="lg" className="navbar-instance">
      <Container fluid className="navbar-menu-container">
        <div className="d-flex w-100 align-items-center">
          {/* Left side - Navigation links */}
          <Nav style={{ fontSize: "0.875rem" }}>
            <Nav.Link href="/" onClick={(e) => handleNavClick('home', e)}>
              <FaHome className="me-1" /> Home
            </Nav.Link>
            <Nav.Link href="/catalogmodels" onClick={(e) => handleNavClick('catalog', e)}>
              <FaBook className="me-1" /> Catalog
            </Nav.Link>
            <Nav.Link href="/projects" onClick={(e) => handleNavClick('workspace', e)}>
              <FaBriefcase className="me-1" /> Workspace
            </Nav.Link>
          </Nav>

          {/* Right side - Account links */}
          <Nav className="ms-auto" style={{ fontSize: "0.875rem" }}>
            <Nav.Link href="/account/profile" onClick={(e) => handleNavClick('account', e)}>
              <FaUser className="me-1" /> Account
            </Nav.Link>
            <Nav.Link href="/logout" onClick={(e) => handleNavClick('logout', e)}>
              <FaSignOutAlt className="me-1" /> Logout
            </Nav.Link>
          </Nav>
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
    </>
  );
}

export default SiteNavbarFluid;
