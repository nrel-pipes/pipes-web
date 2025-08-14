import { Trash2, X } from "lucide-react";
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDeleteTeamMutation, useGetTeamQuery } from '../../hooks/useTeamQuery';
import NavbarSub from '../../layouts/NavbarSub';
import useDataStore from '../../stores/DataStore';


const DeleteTeamPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const { effectivePname } = useDataStore();

  // Get project and team names from query parameters
  const searchParams = new URLSearchParams(location.search);
  const projectName = searchParams.get('project');
  const teamName = searchParams.get('team');

  const currentProjectName = projectName || effectivePname;
  const currentTeamName = teamName;

  // Add debugging
  useEffect(() => {
  }, [currentProjectName, currentTeamName, location.search]);

  // Get team data for confirmation
  const {
    data: team,
    isLoading,
    isError,
    error
  } = useGetTeamQuery(currentProjectName, currentTeamName);

  // Delete team mutation
  const deleteTeamMutation = useDeleteTeamMutation();

  // If params are missing, redirect to teams list
  useEffect(() => {
    if (!currentProjectName || !currentTeamName) {
      navigate('/teams');
    }
  }, [currentProjectName, currentTeamName, navigate]);

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      await deleteTeamMutation.mutateAsync({
        projectName: currentProjectName,
        teamName: currentTeamName
      });
      // Navigate to teams list after successful deletion
      navigate('/teams', {
        state: { deleteSuccess: true, deletedTeamName: currentTeamName }
      });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
        err.message ||
        'Failed to delete team'
      );
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(-1);
  };

  // Show loading state
  if (isLoading) {
    return (
      <>
        <NavbarSub navData={{ pList: true, pName: currentProjectName, tList: true }} />
        <Container className="mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading team details...</p>
        </Container>
      </>
    );
  }

  // Handle error state
  if (isError || !team) {
    return (
      <>
        <NavbarSub navData={{ pList: true, pName: currentProjectName, tList: true }} />
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>
              {error?.message || 'Failed to load team details. The team may not exist.'}
            </p>
            <Button variant="outline-primary" onClick={handleCancel}>
              Go Back
            </Button>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavbarSub navData={{ pList: true, pName: currentProjectName, tList: true, tName: currentTeamName, toDelete: true }} />
      <Container className="mainContent" fluid>
        <Row className="g-0">
          <Col className='mx-auto mt-5' md={8} lg={6}>
            <div className="text-center">
              <h3 className="text-danger mb-4" style={{"paddingTop": "30px", "paddingBottom": "30px"}}>
                Delete Team
              </h3>

              {errorMessage && (
                <Alert variant="danger" className="mb-4">
                  {errorMessage}
                </Alert>
              )}

              <Alert variant="warning">
                <Alert.Heading>Warning: This action cannot be undone</Alert.Heading>
                <p>
                  You are about to delete the team <strong>{currentTeamName}</strong> from
                  project <strong>{currentProjectName}</strong>.
                </p>
                <p>
                  All data associated with this team will be permanently removed.
                  Please confirm that you want to delete this team.
                </p>
              </Alert>

              <div className="d-flex justify-content-center gap-3 mt-5">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="px-4 py-2"
                  disabled={deleteTeamMutation.isPending}
                >
                  <Trash2 size={14} className="me-2" style={{marginTop: '-3px'}}/>
                  {deleteTeamMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="px-4 py-2 d-flex align-items-center"
                  onClick={handleCancel}
                  disabled={deleteTeamMutation.isPending}
                >
                  <X size={16} className="me-2" />
                  No, Cancel
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DeleteTeamPage;
