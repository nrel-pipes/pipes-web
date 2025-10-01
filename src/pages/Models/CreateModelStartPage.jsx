import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Container } from 'react-bootstrap';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from '../Components/ContentHeader';

import "../Components/Cards.css";
import "../PageStyles.css";
import "./CreateModelStartPage.css";


const CreateModelStartPage = () => {
  const { checkAuthStatus } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const projectRunName = searchParams.get("p");
  const projectName = searchParams.get("P");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await checkAuthStatus();

        if (!isAuthenticated) {
          navigate("/login");
          return;
        }
      } catch (error) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, checkAuthStatus]);

  const handleContinue = () => {
    if (isDisabled) return;
    navigate(`/model/new?P=${encodeURIComponent(projectName)}&p=${encodeURIComponent(projectRunName)}`);
  };

  const isDisabled = !projectRunName || !projectName || projectRunName === 'null' || projectName === 'null';

  return (
    <>
      <NavbarSub navData={{pList: true, pName: projectName, prName: projectRunName, mCreate: true}} />
      <Container className="mainContent" fluid>
        <Row className="w-100 mx-0">
          <ContentHeader title="Create Model" />
        </Row>
        {/* Section 1: Current Project */}
        <section style={{ marginTop: 24, marginBottom: 32 }}>
          <h5 className="section-title" style={{ marginBottom: 12, textAlign: "left" }}>Current Project</h5>
          <div className="d-flex justify-content-start">
            <div className="project-info">
              <span className="project-value">{projectName}</span>
            </div>
          </div>
        </section>
        {/* Section 2: Select Project Run */}
        <section>
          <h5 className="section-title" style={{ marginBottom: 12, textAlign: "left" }}>Current Project Run</h5>
          <div className="d-flex justify-content-start">
            <div className="project-info">
              <span className="project-value">{projectRunName}</span>
            </div>
          </div>
        </section>
        <Row className="mt-5">
          <Col className="text-start">
            <button
              className="create-button btn-primary px-4 py-3"
              style={{
                backgroundColor: isDisabled ? '#6c757d' : '#0079c2',
                borderColor: isDisabled ? '#6c757d' : '#0079c2',
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '6px',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
              }}
              onClick={handleContinue}
              disabled={isDisabled}
            >
              Continue
            </button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateModelStartPage;
