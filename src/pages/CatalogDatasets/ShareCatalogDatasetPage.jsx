import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Share2, UserPlus, X } from "lucide-react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from "../Components/ContentHeader";

import { useGetCatalogDatasetQuery, useUpdateCatalogDatasetMutation } from "../../hooks/useCatalogDatasetQuery";
import "../PageStyles.css";


const ShareCatalogDatasetPage = () => {
  const navigate = useNavigate();
  const { datasetName } = useParams();

  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [sharedEmails, setSharedEmails] = useState([]);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { checkAuthStatus, currentUser } = useAuthStore();

  // Fetch existing dataset data
  const { data: datasetData, isLoading: isDatasetDataLoading, error: datasetError } = useGetCatalogDatasetQuery(datasetName);

  // Update dataset mutation
  const updateCatalogDatasetMutation = useUpdateCatalogDatasetMutation();

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

  // Load existing shared users when dataset data is available
  useEffect(() => {
    if (datasetData && datasetData.access_group) {
      setSharedEmails(datasetData.access_group || []);
    }
  }, [datasetData]);

  // Check if current user is authorized to share (must be the creator)
  useEffect(() => {
    if (datasetData && currentUser) {
      const isDatasetCreator = currentUser?.email && datasetData.created_by?.email &&
                             currentUser.email.toLowerCase() === datasetData.created_by.email.toLowerCase();

      if (!isDatasetCreator) {
        // User is not authorized to share this dataset
        navigate(`/catalogdataset/${datasetName}`);
      }
    }
  }, [datasetData, currentUser, navigate, datasetName]);

  // Handle dataset loading error
  useEffect(() => {
    if (datasetError) {
      console.error("Error loading dataset:", datasetError);
      navigate("/catalogdatasets");
    }
  }, [datasetError, navigate]);

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
      // Prepare the update payload with all dataset attributes plus updated access_group
      const updateData = {
        name: datasetData.name,
        display_name: datasetData.display_name,
        description: datasetData.description,
        version: datasetData.version,
        previous_version: datasetData.previous_version || null,
        hash_value: datasetData.hash_value || '',
        data_format: datasetData.data_format || null,
        schema_info: datasetData.schema_info || {},
        location: datasetData.location || {},
        weather_years: datasetData.weather_years || [],
        model_years: datasetData.model_years || [],
        units: datasetData.units || [],
        temporal_info: datasetData.temporal_info || {},
        spatial_info: datasetData.spatial_info || {},
        scenarios: datasetData.scenarios || [],
        sensitivities: datasetData.sensitivities || [],
        source_code: datasetData.source_code || {},
        relevant_links: datasetData.relevant_links || [],
        resource_url: datasetData.resource_url || '',
        access_group: sharedEmails
      };

      await updateCatalogDatasetMutation.mutateAsync({
        datasetName: datasetName,
        data: updateData
      });

      setSuccessMessage("Dataset shared successfully!");

      // Navigate back to dataset details after a short delay
      setTimeout(() => {
        navigate(`/catalogdataset/${datasetName}`);
      }, 1500);
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to share dataset. Please try again."
      );
    }
  };

  const handleCancel = () => {
    navigate(`/catalogdataset/${datasetName}`);
  };

  // Show loading state
  if (isAuthChecking || isDatasetDataLoading) {
    return (
      <>
        <NavbarSub navData={{ cdList: true, cdName: datasetName }} />
        <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
          <Row className="w-100 mx-0">
            <ContentHeader title="Share Dataset"/>
          </Row>
          <Row className="g-0">
            <Col>
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading dataset data...</p>
              </div>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavbarSub navData={{ cdList: true, cdName: datasetName }} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader title={`Share Dataset: ${datasetName}`}/>
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
                  Add email addresses of users you want to share this dataset with.
                  They will be able to view the dataset details.
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
                      disabled={updateCatalogDatasetMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={updateCatalogDatasetMutation.isPending || sharedEmails.length === 0}
                      style={{ backgroundColor: "#0079c2", borderColor: "#0079c2" }}
                    >
                      {updateCatalogDatasetMutation.isPending ? 'Sharing...' : 'Share Dataset'}
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

export default ShareCatalogDatasetPage;
