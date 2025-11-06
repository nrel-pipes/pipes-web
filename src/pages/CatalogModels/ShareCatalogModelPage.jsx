import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Share2, UserPlus, X } from "lucide-react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from "../Components/ContentHeader";

import { useGetCatalogModelQuery, useUpdateCatalogModelMutation } from "../../hooks/useCatalogModelQuery";
import "../PageStyles.css";


const ShareCatalogModelPage = () => {
  const navigate = useNavigate();
  const { modelName } = useParams();

  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [sharedEmails, setSharedEmails] = useState([]);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { checkAuthStatus, currentUser } = useAuthStore();

  // Fetch existing model data
  const { data: modelData, isLoading: isModelDataLoading, error: modelError } = useGetCatalogModelQuery(modelName);

  // Update model mutation
  const updateCatalogModelMutation = useUpdateCatalogModelMutation();

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

  // Load existing shared users when model data is available
  useEffect(() => {
    if (modelData && modelData.access_group) {
      setSharedEmails(modelData.access_group || []);
    }
  }, [modelData]);

  // Check if current user is authorized to share (must be the creator)
  useEffect(() => {
    if (modelData && currentUser) {
      const isModelCreator = currentUser?.email && modelData.created_by?.email &&
                             currentUser.email.toLowerCase() === modelData.created_by.email.toLowerCase();

      if (!isModelCreator) {
        // User is not authorized to share this model
        navigate(`/catalogmodel/${modelName}`);
      }
    }
  }, [modelData, currentUser, navigate, modelName]);

  // Handle model loading error
  useEffect(() => {
    if (modelError) {
      console.error("Error loading model:", modelError);
      navigate("/catalogmodels");
    }
  }, [modelError, navigate]);

  const handleAddEmail = () => {
    setFormError("");
    setSuccessMessage("");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.trim()) {
      setFormError("Please enter an email address");
      return;
    }
    if (!emailRegex.test(emailInput.trim())) {
      setFormError("Please enter a valid email address");
      return;
    }

    const trimmedEmail = emailInput.trim().toLowerCase();

    // Check if email already exists
    if (sharedEmails.includes(trimmedEmail)) {
      setFormError("This email has already been added");
      return;
    }

    // Add email to the list
    setSharedEmails([...sharedEmails, trimmedEmail]);
    setEmailInput("");
  };

  const handleRemoveEmail = (emailToRemove) => {
    setSharedEmails(sharedEmails.filter(email => email !== emailToRemove));
    setFormError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (sharedEmails.length === 0) {
      setFormError("Please add at least one email address to share with");
      return;
    }

    try {
      // Prepare the update payload with all model attributes plus updated access_group
      const updateData = {
        name: modelData.name,
        display_name: modelData.display_name,
        type: modelData.type,
        description: modelData.description,
        modeling_team: modelData.modeling_team,
        assumptions: modelData.assumptions || [],
        expected_scenarios: modelData.expected_scenarios || [],
        requirements: modelData.requirements || {},
        access_group: sharedEmails,
        other: modelData.other || {}
      };

      await updateCatalogModelMutation.mutateAsync({
        modelName: modelName,
        data: updateData
      });

      setSuccessMessage("Model shared successfully!");

      // Navigate back to model details after a short delay
      setTimeout(() => {
        navigate(`/catalogmodel/${modelName}`);
      }, 1500);
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to share model. Please try again."
      );
    }
  };

  const handleCancel = () => {
    navigate(`/catalogmodel/${modelName}`);
  };

  // Show loading state
  if (isAuthChecking || isModelDataLoading) {
    return (
      <>
        <NavbarSub navData={{ cmList: true, cmName: modelName }} />
        <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
          <Row className="w-100 mx-0">
            <ContentHeader title="Share Model"/>
          </Row>
          <Row className="g-0">
            <Col>
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading model data...</p>
              </div>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavbarSub navData={{ cmList: true, cmName: modelName }} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader title={`Share Model: ${modelName}`}/>
        </Row>

        <Row className="g-0 mt-4">
          <Col>
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <Share2 size={24} className="me-2 text-primary" />
                  <h5 className="mb-0">Share with other PIPES Users</h5>
                </div>

                <p className="text-muted mb-4">
                  Add email addresses of users you want to share this model with.
                  They will be able to view the model details.
                </p>

                {formError && (
                  <Alert variant="danger" dismissible onClose={() => setFormError("")}>
                    {formError}
                  </Alert>
                )}

                {successMessage && (
                  <Alert variant="success" dismissible onClose={() => setSuccessMessage("")}>
                    {successMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Email Input */}
                  <Form.Group className="mb-4">
                    <Form.Label style={{ display: 'block', textAlign: 'left' }}>Email Address</Form.Label>
                    <div className="d-flex gap-2" style={{ maxWidth: '600px' }}>
                      <Form.Control
                        type="email"
                        placeholder="Enter user email address"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddEmail();
                          }
                        }}
                      />
                      <Button
                        variant="outline-primary"
                        onClick={handleAddEmail}
                        style={{ minWidth: '100px' }}
                      >
                        <UserPlus size={16} className="me-1" />
                        Add
                      </Button>
                    </div>
                  </Form.Group>

                  {/* Shared Users List */}
                  {sharedEmails.length > 0 && (
                    <div className="mb-4">
                      <h6 className="mb-3">Shared with ({sharedEmails.length})</h6>
                      <div className="border rounded p-3" style={{ maxHeight: '300px', maxWidth: '600px', overflowY: 'auto' }}>
                        {sharedEmails.map((email, index) => (
                          <div
                            key={index}
                            className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded"
                          >
                            <span>{email}</span>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-danger p-0"
                              onClick={() => handleRemoveEmail(email)}
                            >
                              <X size={18} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-start gap-2 mt-4">
                    <Button
                      variant="outline-secondary"
                      onClick={handleCancel}
                      disabled={updateCatalogModelMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={updateCatalogModelMutation.isPending || sharedEmails.length === 0}
                      style={{ backgroundColor: "#0079c2", borderColor: "#0079c2" }}
                    >
                      {updateCatalogModelMutation.isPending ? 'Sharing...' : 'Share Model'}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ShareCatalogModelPage;
