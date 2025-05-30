import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";

import { useGetProjectsQuery } from "../../hooks/useProjectQuery";
import useAuthStore from "../../stores/AuthStore";

import NavbarSub from "../../layouts/NavbarSub";
import ContentHeader from "../Components/ContentHeader";
import UpcomingMilestonesComponent from "./UpcomingMilestonesComponent";

import "../PageStyles.css";

const ProjectMilestonesPage = () => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuthStore();
  const {
    data: projectBasics = [],
    isLoading: isLoadingBasics,
    isError: isErrorBasics,
    error: errorBasics,
  } = useGetProjectsQuery();

  // Auth check effect - updated to use checkAuthStatus
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await checkAuthStatus();

        if (!isAuthenticated) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, checkAuthStatus]);

  if (isLoadingBasics) {
    return (
      <>
      <NavbarSub />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="mt-5">
          <Col>
            <FontAwesomeIcon icon={faSpinner} spin size="xl" />
          </Col>
        </Row>
      </Container>
      </>
    );
  }

  if (isErrorBasics) {
    return (
      <>
      <NavbarSub />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="mt-5">
          <Col>
            <p style={{ color: "red" }}>{errorBasics.message}</p>
          </Col>
        </Row>
      </Container>
      </>
    );
  }

  if (!projectBasics || projectBasics.length === 0) {
    return (
      <>
      <NavbarSub />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="mt-5">
          <Col>
            <p style={{ fontSize: "16px" }}>
              You currently do not have any milestones in your projects.
            </p>
          </Col>
        </Row>
      </Container>
      </>
    );
  }

  return (
    <>
    <NavbarSub navData = {{pList: true, pmAll: true}} />
    <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
      <Row className="w-100 mx-0">
        <ContentHeader title="Upcoming Milestones" />
      </Row>
      <Row className="w-100 mx-0">
        <UpcomingMilestonesComponent projectBasics={projectBasics} />
      </Row>
    </Container>
    </>
  );
};

export default ProjectMilestonesPage;
