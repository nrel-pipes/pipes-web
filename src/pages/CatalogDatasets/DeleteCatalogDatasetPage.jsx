import { useQueryClient } from '@tanstack/react-query';
import { Trash2, X } from "lucide-react";
import { useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteCatalogDatasetMutation, useGetCatalogDatasetQuery } from '../../hooks/useCatalogDatasetQuery';
import NavbarSub from '../../layouts/NavbarSub';


const DeleteCatalogDatasetPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { datasetName } = useParams();

  const {
    data: dataset,
    isLoading,
    isError,
    error
  } = useGetCatalogDatasetQuery(datasetName, {
    enabled: !isDeleting, // Disable query when deleting
  });

  // Delete model mutation
  const deleteCatalogDatasetMutation = useDeleteCatalogDatasetMutation();

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // Cancel any ongoing queries for this model before deletion
      await queryClient.cancelQueries({
        queryKey: ["catalogDataset", datasetName]
      });

      await deleteCatalogDatasetMutation.mutateAsync(datasetName);

      // Remove the query for the deleted model from the cache
      queryClient.removeQueries({
        queryKey: ["catalogDataset", datasetName]
      });

      // Also invalidate the catalog models list
      queryClient.invalidateQueries({
        queryKey: ["catalogDatasets"]
      });

      // Navigate to models list after successful deletion
      navigate('/catalogdatasets', {
        state: { deleteSuccess: true, deletedDatasetName: datasetName },
        replace: true // Use replace to prevent going back to delete page
      });
    } catch (err) {
      setIsDeleting(false);
      setErrorMessage(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete dataset'
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
        <NavbarSub navData={{ cdList: true, cdName: datasetName, toDelete: true }} />
        <Container className="mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dataset details...</p>
        </Container>
      </>
    );
  }

  // Handle error state
  if (isError || !dataset) {
    return (
      <>
        <NavbarSub navData={{ cdList: true, cdName: datasetName, toDelete: true }} />
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>
              {error?.message || 'Failed to load dataset details. The dataset may not exist.'}
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
      <NavbarSub navData={{ cdList: true, cdName: datasetName, toDelete: true }} />
      <Container className="mainContent" fluid>
        <Row className="g-0">
          <Col className='mx-auto mt-5' md={8} lg={6}>
            <div className="text-center">
              <h3 className="text-danger mb-4" style={{"paddingTop": "30px", "paddingBottom": "30px"}}>
                Delete Dataset from Catalog
              </h3>

              {errorMessage && (
                <Alert variant="danger" className="mb-4">
                  {errorMessage}
                </Alert>
              )}

              <Alert variant="warning">
                <Alert.Heading>Warning: This action cannot be undone</Alert.Heading>
                <p>
                  You are about to delete the dataset <strong>{datasetName}</strong> from the catalog.
                </p>
                <p>
                  All data associated with this dataset will be permanently removed from the catalog.
                  Please confirm that you want to delete this dataset.
                </p>
              </Alert>

              <div className="d-flex justify-content-center gap-3 mt-5">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="px-4 py-2"
                  disabled={deleteCatalogDatasetMutation.isPending || isDeleting}
                >
                  <Trash2 size={14} className="me-2" style={{marginTop: '-3px'}}/>
                  {deleteCatalogDatasetMutation.isPending || isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="px-4 py-2 d-flex align-items-center"
                  onClick={handleCancel}
                  disabled={deleteCatalogDatasetMutation.isPending || isDeleting}
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

export default DeleteCatalogDatasetPage;
