import { Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useNavigate, useParams } from "react-router-dom";

import { useDeleteProjectMutation } from "../../hooks/useProjectQuery";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";

import "../Components/Cards.css";
import "../FormStyles.css";
import "../PageStyles.css";
import "./ProjectPage.css";


const DeleteProjectPage = () => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuthStore();
  const { setEffectivePname, effectivePname } = useDataStore();
  const { projectName } = useParams();

  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [deleteError, setDeleteError] = useState(null);

  // Delete project mutation
  const deleteProjectMutation = useDeleteProjectMutation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsAuthChecking(true);
        const isAuthenticated = await checkAuthStatus();
        if (!isAuthenticated) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/login");
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [navigate, checkAuthStatus]);

  // Handle cancel button click
  const handleCancel = () => {
    navigate("/project/dashboard");
  };

  // Handle confirm button click
  const handleConfirm = () => {
    const targetProject = projectName || effectivePname;

    setDeleteError(null);

    deleteProjectMutation.mutate({ projectName: targetProject }, {
      onSuccess: () => {
        // Navigate to projects list after successful deletion
        navigate("/projects");
      },
      onError: (error) => {
        setDeleteError(parseErrorResponse(error));
      }
    });
  };

  // Enhanced error handling with error parsing
  const parseErrorResponse = (error) => {
    if (error?.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        return error.response.data.detail.map(item => {
          const path = Array.isArray(item.loc) ? item.loc.slice(1).join('.') : item.loc;
          return `${path} - ${item.msg}`;
        });
      } else if (typeof error.response.data.detail === 'string') {
        return [error.response.data.detail];
      }
    }

    if (error?.response?.data) {
      const errorDetails = [];
      Object.entries(error.response.data).forEach(([field, messages]) => {
        if (field !== 'detail' && Array.isArray(messages)) {
          messages.forEach(msg => {
            errorDetails.push(`${field}: ${msg}`);
          });
        }
      });

      if (errorDetails.length > 0) {
        return errorDetails;
      }
    }

    if (error?.message && error.message !== error?.response?.statusText) {
      return [error.message];
    }

    return ["An unexpected error occurred. Please try again."];
  };

  // Don't render content until auth check is complete
  if (isAuthChecking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavbarSub navData={{ pList: true, pName: effectivePname, toDelete: true }} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="justify-content-center">
          <Col className='mx-auto mt-5' md={8} lg={6}>
            <div className="text-center">
              <h3 className="mb-4 text-danger" style={{"paddingTop": "30px", "paddingBottom": "30px"}}>
                Delete Project
              </h3>

              {deleteError && (
                <div className="alert alert-danger mb-4">
                  <p className="mb-0">Failed to delete project</p>
                  <ul className="mb-0 mt-2">
                    {Array.isArray(deleteError) ? deleteError.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    )) : <li>{deleteError}</li>}
                  </ul>
                </div>
              )}

              <Alert variant="warning">
                <Alert.Heading>Warning: This action cannot be undone</Alert.Heading>
                <p>
                  You are about to delete project '<strong>{effectivePname || projectName}</strong>'.
                </p>
                <p>
                  All data associated with this project will be permanently removed.
                  Please confirm that you want to delete this project.
                </p>
              </Alert>

              <div className="d-flex justify-content-center gap-3 mt-5">
                <Button
                  variant="danger"
                  onClick={handleConfirm}
                  className="px-4 py-2"
                  disabled={deleteProjectMutation.isPending}
                >
                  <Trash2 size={14} className="me-2" style={{marginTop: '-3px'}}/>
                  {deleteProjectMutation.isPending ? "Deleting..." : "Yes, Delete"}
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={handleCancel}
                  className="px-4 py-2 d-flex align-items-center"
                  disabled={deleteProjectMutation.isPending}
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

export default DeleteProjectPage;
