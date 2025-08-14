import { Trash2, X } from "lucide-react";
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDeleteModelMutation, useGetModelQuery } from '../../hooks/useModelQuery';
import NavbarSub from '../../layouts/NavbarSub';
import useDataStore from '../../stores/DataStore';

const DeleteModelPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const { effectivePname } = useDataStore();

  // Get project and model names from query parameters
  const searchParams = new URLSearchParams(location.search);
  const projectName = searchParams.get('project');
  const projectRunName = searchParams.get('projectrun');
  const modelName = searchParams.get('model');

  const currentProjectName = projectName || effectivePname;
  const currentProjectRunName = projectRunName;
  const currentModelName = modelName;

  // Add debugging
  useEffect(() => {
  }, [currentProjectName, currentProjectRunName, currentModelName, location.search]);

  // Get model data for confirmation
  const {
    data: model,
    isLoading,
    isError,
    error
  } = useGetModelQuery(currentProjectName, currentProjectRunName, currentModelName);

  // Delete model mutation
  const deleteModelMutation = useDeleteModelMutation();

  // If params are missing, redirect to models list
  useEffect(() => {
    if (!currentProjectName || !currentModelName) {
      navigate('/models');
    }
  }, [currentProjectName, currentModelName, navigate]);

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      await deleteModelMutation.mutateAsync({
        projectName: currentProjectName,
        projectRunName: currentProjectRunName,
        modelName: currentModelName
      });
      // Navigate to models list after successful deletion
      navigate('/models', {
        state: { deleteSuccess: true, deletedModelName: currentModelName }
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
        <NavbarSub navData={{ pList: true, pName: currentProjectName, prName: currentProjectRunName, mList: true, mName: currentModelName, toDelete: true }} />
        <Container className="mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading model details...</p>
        </Container>
      </>
    );
  }

  // Handle error state
  if (isError || !model) {
    return (
      <>
        <NavbarSub navData={{ pList: true, pName: currentProjectName, prName: currentProjectRunName, mName: currentModelName, toDelete: true }} />
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>
              {error?.message || 'Failed to load model details. The model may not exist.'}
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
      <NavbarSub navData={{ pList: true, pName: currentProjectName, prName: currentProjectRunName, mName: currentModelName, toDelete: true }} />
      <Container className="mainContent" fluid>
        <Row className="g-0">
          <Col className='mx-auto mt-5' md={8} lg={6}>
            <div className="text-center">
              <h3 className="text-danger mb-4" style={{"paddingTop": "30px", "paddingBottom": "30px"}}>
                Delete Model
              </h3>

              {errorMessage && (
                <Alert variant="danger" className="mb-4">
                  {errorMessage}
                </Alert>
              )}

              <Alert variant="warning">
                <Alert.Heading>Warning: This action cannot be undone</Alert.Heading>
                <p>
                  You are about to delete the model <strong>{currentModelName}</strong> from
                  project <strong>{currentProjectName}</strong>.
                </p>
                <p>
                  All data associated with this model will be permanently removed.
                  Please confirm that you want to delete this model.
                </p>
              </Alert>

              <div className="d-flex justify-content-center gap-3 mt-5">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="px-4 py-2"
                  disabled={deleteModelMutation.isPending}
                >
                  <Trash2 size={14} className="me-2" style={{marginTop: '-3px'}}/>
                  {deleteModelMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="px-4 py-2 d-flex align-items-center"
                  onClick={handleCancel}
                  disabled={deleteModelMutation.isPending}
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

export default DeleteModelPage;
