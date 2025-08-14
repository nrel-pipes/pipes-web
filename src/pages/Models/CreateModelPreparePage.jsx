import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from 'react-bootstrap';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useGetProjectRunsQuery } from "../../hooks/useProjectRunQuery";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";
import ContentHeader from '../Components/ContentHeader';

import "../Components/Cards.css";
import "../PageStyles.css";
import ReturnToModelsButton from './Components/ReturnToModelsButton';
import "./CreateModelPreparePage.css";


const CreateModelPreparePage = () => {
  const { checkAuthStatus } = useAuthStore();
  const { effectivePname } = useDataStore();
  const navigate = useNavigate();
  const [selectedRun, setSelectedRun] = useState(null);

  // All hooks must be called before any conditional logic
  const { data: projectRunsData = [], isLoading, error } = useGetProjectRunsQuery(effectivePname);

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

  const handleReturnToModels = () => {
    navigate("/models");
  };

  const handleAddProjectRun = () => {
    navigate("/create-projectrun");
  };

  const handleContinue = () => {
    if (selectedRun) {
      navigate(`/create-model?project=${encodeURIComponent(effectivePname)}&projectrun=${encodeURIComponent(selectedRun)}`);
    }
  };

  if (isLoading) {
    return (
      <>
        <NavbarSub/>
        <Container className="mainContent">
          <Row className="mt-5">
            <Col>
              <FontAwesomeIcon icon={faSpinner} spin size="xl" />
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavbarSub/>
        <Container className="mainContent">
          <Row className="mt-5">
            <Col>
              <p style={{ color: "red" }}>
                {error.message || 'Failed to load models'}
              </p>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (!projectRunsData || projectRunsData.length === 0) {
    return (
      <>
        <NavbarSub/>
        <Container className="mainContent model-prepare-container" fluid>
          <Row className="w-100 mx-0">
            <ContentHeader title="Prepare Model Creation" />
          </Row>
          <div className="empty-state-container">
            <div className="empty-state-card">
              <div className="empty-state-icon">
                <i className="bi bi-cpu-fill"></i>
              </div>
              <h3 className="empty-state-title">No Project Runs Found</h3>
              <p className="empty-state-description">
                You don't have any project runs yet. Get started by creating your first project run!
              </p>
              <div className="empty-state-actions">
                <button className="create-button" onClick={handleAddProjectRun}>
                  <Plus size={16} className="create-button-icon" />
                  Add Project Run
                </button>
                <button className="create-button secondary" onClick={handleReturnToModels}>
                  Return to Models
                </button>
              </div>
            </div>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavbarSub navData={{pList: true, pName: effectivePname, mCreate: true}} />
      <Container className="mainContent" fluid>
        <Row className="w-100 mx-0">
          <ContentHeader title="Create Model" headerButton={<ReturnToModelsButton />} />
        </Row>
        {/* Section 1: Current Project */}
        <section style={{ marginTop: 24, marginBottom: 32 }}>
          <h5 className="section-title" style={{ marginBottom: 12, textAlign: "left" }}>Current Project</h5>
          <div className="d-flex justify-content-start">
            <div className="project-info">
              <span className="project-value">{effectivePname}</span>
            </div>
          </div>
        </section>
        {/* Section 2: Select Project Run */}
        <section>
          <h5 className="section-title" style={{ marginBottom: 12, textAlign: "left" }}>Select Project Run</h5>
          <div className="run-card-list row" style={{ marginLeft: 0, marginRight: 0 }}>
            {projectRunsData.map((run) => (
              <div
                key={run.name}
                className={`col-12 col-md-6 col-lg-6`}
                style={{ marginBottom: "24px" }}
              >
                <div
                  className={`run-card${selectedRun === run.name ? " selected" : ""}`}
                  onClick={() => setSelectedRun(run.name)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedRun === run.name}
                  style={{
                    textAlign: "left",
                    minWidth: "0",
                    maxWidth: "100%",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div className="run-card-header" style={{ textAlign: "left" }}>
                    <span className="run-card-title">{run.display_name || run.name}</span>
                    {selectedRun === run.name && (
                      <span className="run-card-selected-badge">Selected</span>
                    )}
                  </div>
                  <div className="run-card-detail">Name: <span>{run.name}</span></div>
                  <div className="run-card-detail">
                    Description: <span>{run.description || "No description"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <Row className="mt-4">
          <Col className="text-end">
            <button
              className="create-button btn-primary px-4 py-3"
              style={{
                backgroundColor: selectedRun ? '#0079c2' : "#ccc",
                borderColor: '#0079c2',
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '6px',
                minWidth: '180px',
                cursor: selectedRun ? 'pointer' : 'not-allowed',
              }}
              onClick={handleContinue}
              disabled={!selectedRun}
            >
              Continue
            </button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateModelPreparePage;
