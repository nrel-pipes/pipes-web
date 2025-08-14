import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Card, Container, Table } from 'react-bootstrap';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useListTeamsQuery } from '../../hooks/useTeamQuery';
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";
import ContentHeader from '../Components/ContentHeader';
import GetTeamPage from "./GetTeamPage";

import "../Components/Cards.css";
import "../PageStyles.css";
import TeamCreationButton from "./Components/TeamCreationButton";


const ListTeamsPage = () => {
  const { checkAuthStatus } = useAuthStore();
  const { effectivePname } = useDataStore();
  const location = useLocation();
  const navigate = useNavigate();

  // All hooks must be called before any conditional logic
  const { data: teams = [], isLoading, error } = useListTeamsQuery(effectivePname);

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

  // Check if we have query parameters for team details
  const searchParams = new URLSearchParams(location.search);
  const teamName = searchParams.get('team');

  // If we have a team parameter, render the GetTeamPage instead
  if (teamName) {
    return <GetTeamPage />;
  }

  const handleCreateTeamClick = () => {
    navigate("/create-team");
  };

  const handleViewTeamClick = (teamName) => {
    navigate(`/teams?project=${encodeURIComponent(effectivePname)}&team=${encodeURIComponent(teamName)}`);
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
                {error.message || 'Failed to load teams'}
              </p>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <>
        <NavbarSub/>
        <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
          <div className="empty-state-container">
            <div className="empty-state-card">
              <div className="empty-state-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <h3 className="empty-state-title">No Teams Found</h3>
              <p className="empty-state-description">
                You don't have any teams yet. Get started by creating your first team!
              </p>
              <div className="empty-state-actions">
                <button
                  className="create-button"
                  onClick={handleCreateTeamClick}
                >
                  <Plus size={16} className="create-button-icon" />
                  Create Team
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
      <NavbarSub navData={{pList: true, pName: effectivePname, tList: true}} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader
            title="Teams"
            cornerMark={teams.length}
            headerButton={<TeamCreationButton isDisabled={effectivePname === "pipes101"} />}
          />
        </Row>

        {/* Teams Table */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body style={{ padding: 0 }}>
                <div className="table-responsive">
                  <Table className="table table-striped table-hover mb-0" style={{ fontSize: '1rem' }}>
                    <thead style={{ backgroundColor: 'var(--bs-gray-100)' }}>
                      <tr style={{ borderTop: '3px solid #0071b8' }}>
                        <th scope="col" style={{
                          padding: '1.5rem 1.5rem',
                          fontWeight: '700',
                          color: 'var(--bs-gray-700)',
                          border: 'none',
                          borderBottom: '1px solid var(--bs-border-color)',
                          textAlign: 'left',
                          width: '25%'
                        }}>
                          Name
                        </th>
                        <th scope="col" style={{
                          padding: '1.5rem 1.5rem',
                          fontWeight: '700',
                          color: 'var(--bs-gray-700)',
                          border: 'none',
                          borderBottom: '1px solid var(--bs-border-color)',
                          textAlign: 'left',
                          width: '30%'
                        }}>
                          Description
                        </th>
                        <th scope="col" style={{
                          padding: '1.5rem 1.5rem',
                          fontWeight: '700',
                          color: 'var(--bs-gray-700)',
                          border: 'none',
                          borderBottom: '1px solid var(--bs-border-color)',
                          textAlign: 'left',
                          width: '15%'
                        }}>
                          Project
                        </th>
                        <th scope="col" style={{
                          padding: '1.5rem 1.5rem',
                          fontWeight: '700',
                          color: 'var(--bs-gray-700)',
                          border: 'none',
                          borderBottom: '1px solid var(--bs-border-color)',
                          textAlign: 'left',
                          width: '15%'
                        }}>
                          Members
                        </th>
                        <th scope="col" style={{
                          padding: '1.5rem 1.5rem',
                          fontWeight: '700',
                          color: 'var(--bs-gray-700)',
                          border: 'none',
                          borderBottom: '1px solid var(--bs-border-color)',
                          textAlign: 'center',
                          width: '15%'
                        }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.map((team, index) => (
                        <tr key={team.id || team.name || index} style={{
                          borderBottom: '1px solid var(--bs-border-color)',
                          color: 'var(--bs-body-color)'
                        }}>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            color: 'var(--bs-dark)',
                            textAlign: 'left',
                            fontWeight: '500'
                          }}>
                            {team.name}
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            color: 'var(--bs-gray-600)',
                            textAlign: 'left'
                          }}>
                            {team.description || 'No description provided'}
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            color: 'var(--bs-gray-600)',
                            textAlign: 'left'
                          }}>
                            {effectivePname || 'N/A'}
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            textAlign: 'left'
                          }}>
                            <span style={{
                              fontSize: '0.8rem',
                              padding: '0.4rem 0.8rem',
                              borderRadius: 'var(--bs-border-radius-pill)',
                              backgroundColor: '#0079c2',
                              color: 'white',
                              display: 'inline-block',
                              fontWeight: '500'
                            }}>
                              {team.members ? team.members.length : 0} member{(team.members?.length || 0) !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            textAlign: 'center'
                          }}>
                            <button
                              className="btn btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewTeamClick(team.name);
                              }}
                              style={{
                                fontWeight: '500',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--bs-border-radius)',
                                fontSize: '0.875rem',
                                backgroundColor: '#0079c2',
                                borderColor: '#0079c2',
                                color: 'white'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#005a94';
                                e.target.style.borderColor = '#005a94';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#0079c2';
                                e.target.style.borderColor = '#0079c2';
                              }}
                            >
                              View Team Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ListTeamsPage;
