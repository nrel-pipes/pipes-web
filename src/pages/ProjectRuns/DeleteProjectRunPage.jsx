import { Trash2, X } from "lucide-react";
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDeleteProjectRunMutation, useGetProjectRunQuery } from '../../hooks/useProjectRunQuery';
import NavbarSub from '../../layouts/NavbarSub';
import useDataStore from '../../stores/DataStore';

const DeleteProjectRunPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const { effectivePname, effectivePRname } = useDataStore();

  const currentProjectName = effectivePname;
  const currentRunName = effectivePRname || location.state?.projectRunName;

  // Get project run data for confirmation
  const {
    data: projectRun,
    isLoading,
    isError,
    error
  } = useGetProjectRunQuery(currentProjectName, currentRunName);

  // Delete project run mutation
  const deleteProjectRunMutation = useDeleteProjectRunMutation();

  // If params are missing, redirect to project dashboard
  useEffect(() => {
    if (!currentProjectName || !currentRunName) {
      navigate('/project/dashboard');
    }
  }, [currentProjectName, currentRunName, navigate]);

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      await deleteProjectRunMutation.mutateAsync({
        projectName: currentProjectName,
        projectRunName: currentRunName
      });
      // Navigate to project runs list after successful deletion
      navigate(`/project/dashboard`, {
        state: { deleteSuccess: true, deletedRunName: currentRunName }
      });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
        err.message ||
        'Failed to delete project run'
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
        <NavbarSub navData={{ pList: true, pName: currentProjectName }} />
        <Container className="mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading project run details...</p>
        </Container>
      </>
    );
  }

  // Handle error state
  if (isError || !projectRun) {
    return (
      <>
        <NavbarSub navData={{ pList: true, pName: currentProjectName }} />
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>
              {error?.message || 'Failed to load project run details. The project run may not exist.'}
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
      <NavbarSub navData={{ pList: true, pName: currentProjectName, prName: currentRunName, toDelete: true }} />
      <Container className="mainContent" fluid>
        <Row className="g-0">
          <Col className='mx-auto mt-5' md={8} lg={6}>
            <div className="text-center">
              <h3 className="text-danger mb-4" style={{"paddingTop": "30px", "paddingBottom": "30px"}}>
                Delete Project Run
              </h3>

              {errorMessage && (
                <Alert variant="danger" className="mb-4">
                  {errorMessage}
                </Alert>
              )}

              <Alert variant="warning">
                <Alert.Heading>Warning: This action cannot be undone</Alert.Heading>
                <p>
                  You are about to delete the project run <strong>{currentRunName}</strong> from
                  project <strong>{currentProjectName}</strong>.
                </p>
                <p>
                  All data associated with this project run will be permanently removed.
                  Please confirm that you want to delete this project run.
                </p>
              </Alert>

              <div className="d-flex justify-content-center gap-3 mt-5">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="px-4 py-2"
                  disabled={deleteProjectRunMutation.isPending}
                >
                  <Trash2 size={14} className="me-2" style={{marginTop: '-3px'}}/>
                  {deleteProjectRunMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="px-4 py-2 d-flex align-items-center"
                  onClick={handleCancel}
                  disabled={deleteProjectRunMutation.isPending}
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

export default DeleteProjectRunPage;
