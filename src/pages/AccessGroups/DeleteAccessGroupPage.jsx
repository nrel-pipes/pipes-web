import { Trash2, X } from "lucide-react";
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteAccessGroupMutation, useGetAccessGroupQuery } from '../../hooks/useAccessGroupQuery';
import NavbarSub from '../../layouts/NavbarSub';


const DeleteAccessGroupPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { accessGroupName } = useParams();

  // Add debugging
  useEffect(() => {
  }, [accessGroupName]);

  // Get access group data for confirmation
  const {
    data: accessGroup,
    isLoading,
    isError,
    error
  } = useGetAccessGroupQuery(accessGroupName);

  // Delete access group mutation
  const deleteAccessGroupMutation = useDeleteAccessGroupMutation();

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      await deleteAccessGroupMutation.mutateAsync({
        accessGroupName: accessGroupName
      });
      // Navigate to access groups list after successful deletion
      navigate('/accessgroups', {
        state: { deleteSuccess: true, deletedAccessGroupName: accessGroupName }
      });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
        err.message ||
        'Failed to delete access group'
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
        <NavbarSub />
        <Container className="mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading access group details...</p>
        </Container>
      </>
    );
  }

  // Handle error state
  if (isError || !accessGroup) {
    return (
      <>
        <NavbarSub />
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>
              {error?.message || 'Failed to load access group details. The access group may not exist.'}
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
      <NavbarSub />
      <Container className="mainContent" fluid>
        <Row className="g-0">
          <Col className='mx-auto mt-5' md={8} lg={6}>
            <div className="text-center">
              <h3 className="text-danger mb-4" style={{"paddingTop": "30px", "paddingBottom": "30px"}}>
                Delete Access Group
              </h3>

              {errorMessage && (
                <Alert variant="danger" className="mb-4">
                  {errorMessage}
                </Alert>
              )}

              <Alert variant="warning">
                <Alert.Heading>Warning: This action cannot be undone</Alert.Heading>
                <p>
                  You are about to delete the access group <strong>{accessGroupName}</strong>.
                </p>
                <p>
                  All data associated with this access group will be permanently removed.
                  Please confirm that you want to delete this access group.
                </p>
              </Alert>

              <div className="d-flex justify-content-center gap-3 mt-5">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="px-4 py-2"
                  disabled={deleteAccessGroupMutation.isPending}
                >
                  <Trash2 size={14} className="me-2" style={{marginTop: '-3px'}}/>
                  {deleteAccessGroupMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="px-4 py-2 d-flex align-items-center"
                  onClick={handleCancel}
                  disabled={deleteAccessGroupMutation.isPending}
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

export default DeleteAccessGroupPage;
