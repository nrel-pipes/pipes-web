import { Trash2, X } from "lucide-react";
import { useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDeleteProjectRunMutation, useGetProjectRunQuery } from '../../hooks/useProjectRunQuery';
import NavbarSub from '../../layouts/NavbarSub';

const DeleteProjectRunPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { projectRunName } = useParams();
  const searchParams = new URLSearchParams(location.search);
  const projectName = searchParams.get("P");
  const [errorMessage, setErrorMessage] = useState('');

  // Get project run data for confirmation
  const {
    data: projectRun,
    isLoading,
    isError,
    error
  } = useGetProjectRunQuery(projectName, projectRunName);

  // Delete project run mutation
  const deleteProjectRunMutation = useDeleteProjectRunMutation();

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      await deleteProjectRunMutation.mutateAsync({
        projectName: projectName,
        projectRunName: projectRunName
      });
      // Navigate to project runs list after successful deletion
      navigate(`/dashboard?P=${encodeURIComponent(projectName)}`, {
        state: { deleteSuccess: true, deletedRunName: projectRunName }
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
        <NavbarSub navData={{ pList: true, pName: projectName }} />
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
        <NavbarSub navData={{ pList: true, pName: projectName }} />
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
      <NavbarSub navData={{ pList: true, pName: projectName, prName: projectRunName, toDelete: true }} />
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
                  You are about to delete the project run <strong>{projectRunName}</strong> from
                  project <strong>{projectName}</strong>.
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
