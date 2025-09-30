import { Trash2, X } from "lucide-react";
import { useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDeleteHandoffMutation, useGetHandoffQuery } from '../../hooks/useHandoffQuery';
import NavbarSub from '../../layouts/NavbarSub';

const DeleteHandoffPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const { handoffName } = useParams();

  // Get project and model names from query parameters
  const searchParams = new URLSearchParams(location.search);
  const projectName = searchParams.get('P');
  const projectRunName = searchParams.get('p');

  const {
    data: handoff,
    isLoading,
    isError,
    error
  } = useGetHandoffQuery(projectName, projectRunName, handoffName);

  // Delete handoff mutation
  const deleteHandoffMutation = useDeleteHandoffMutation();

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      await deleteHandoffMutation.mutateAsync({
        projectName: projectName,
        projectRunName: projectRunName,
        handoffName: handoffName
      });
      // Navigate to handoffs list after successful deletion
      navigate(`/projectrun/${encodeURIComponent(projectRunName)}?P=${encodeURIComponent(projectName)}`, {
        state: { deleteSuccess: true, deletedHandoffName: handoffName }
      });
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete model'
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
        <NavbarSub navData={{ pList: true, pName: projectName, prName: projectRunName, hList: true, hName: handoffName, toDelete: true }} />
        <Container className="mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading handoff details...</p>
        </Container>
      </>
    );
  }

  // Handle error state
  if (isError || !handoff) {
    return (
      <>
        <NavbarSub navData={{ pList: true, pName: projectName, prName: projectRunName, hList: true, hName: handoffName, toDelete: true }} />
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>
              {error?.message || 'Failed to load handoff details. The handoff may not exist.'}
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
      <NavbarSub navData={{ pList: true, pName: projectName, prName: projectRunName, hList: true, hName: handoffName, toDelete: true }} />
      <Container className="mainContent" fluid>
        <Row className="g-0">
          <Col className='mx-auto mt-5' md={8} lg={6}>
            <div className="text-center">
              <h3 className="text-danger mb-4" style={{"paddingTop": "30px", "paddingBottom": "30px"}}>
                Delete Handoff
              </h3>

              {errorMessage && (
                <Alert variant="danger" className="mb-4">
                  {errorMessage}
                </Alert>
              )}

              <Alert variant="warning">
                <Alert.Heading>Warning: This action cannot be undone</Alert.Heading>
                <p>
                  You are about to delete the handoff <strong>{handoffName}</strong> from
                  project <strong>{projectName}</strong>.
                </p>
                <p>
                  All data associated with this handoff will be permanently removed.
                  Please confirm that you want to delete this handoff.
                </p>
              </Alert>

              <div className="d-flex justify-content-center gap-3 mt-5">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="px-4 py-2"
                  disabled={deleteHandoffMutation.isPending}
                >
                  <Trash2 size={14} className="me-2" style={{marginTop: '-3px'}}/>
                  {deleteHandoffMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="px-4 py-2 d-flex align-items-center"
                  onClick={handleCancel}
                  disabled={deleteHandoffMutation.isPending}
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

export default DeleteHandoffPage;
