import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Share2, Users } from "lucide-react";
import { Alert, Badge, Button, Container, Form } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from "../Components/ContentHeader";

import { useListAccessGroupsQuery } from "../../hooks/useAccessGroupQuery";
import { useGetCatalogDatasetQuery, useUpdateCatalogDatasetMutation } from "../../hooks/useCatalogDatasetQuery";
import "../PageStyles.css";


const ShareCatalogDatasetPage = () => {
  const navigate = useNavigate();
  const { datasetName } = useParams();

  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [selectedAccessGroupNames, setSelectedAccessGroupNames] = useState([]);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { checkAuthStatus, currentUser } = useAuthStore();

  // Fetch existing dataset data
  const { data: datasetData, isLoading: isDatasetDataLoading, error: datasetError } = useGetCatalogDatasetQuery(datasetName);

  // Fetch all access groups
  const { data: accessGroups = [], isLoading: isAccessGroupsLoading } = useListAccessGroupsQuery();

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

  // Load existing access groups when dataset data is available
  useEffect(() => {
    if (datasetData && datasetData.access_group) {
      // Handle different formats (string, array, object)
      if (typeof datasetData.access_group === 'string') {
        setSelectedAccessGroupNames([datasetData.access_group]);
      } else if (Array.isArray(datasetData.access_group)) {
        const groupNames = datasetData.access_group.map(item =>
          typeof item === 'string' ? item : item.name
        ).filter(Boolean);
        setSelectedAccessGroupNames(groupNames);
      } else if (typeof datasetData.access_group === 'object' && datasetData.access_group.name) {
        setSelectedAccessGroupNames([datasetData.access_group.name]);
      }
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

  // Get selected access groups details
  const selectedAccessGroups = accessGroups.filter(ag =>
    selectedAccessGroupNames.includes(ag.name)
  );

  const handleAccessGroupToggle = (groupName) => {
    setSelectedAccessGroupNames(prev => {
      if (prev.includes(groupName)) {
        return prev.filter(name => name !== groupName);
      } else {
        return [...prev, groupName];
      }
    });
    setFormError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (selectedAccessGroupNames.length === 0) {
      setFormError("Please select at least one access group to share with");
      return;
    }

    try {
      // Prepare the update payload - send access_group as array
      const updateData = {
        access_group: selectedAccessGroupNames
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
  if (isAuthChecking || isDatasetDataLoading || isAccessGroupsLoading) {
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
                <p className="mt-2">Loading...</p>
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
            <div className="card shadow-sm" style={{ cursor: 'default' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <Share2 size={24} className="me-2 text-primary" />
                  <h5 className="mb-0">Share with Access Group</h5>
                </div>

                <p className="text-muted mb-4">
                  Select one or more access groups to share this dataset with. All members of the selected groups will be able to view the dataset details.
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
                  {/* Access Group Selection */}
                  <Form.Group className="mb-4">
                    <Form.Label style={{ display: 'block', textAlign: 'left', fontWeight: '600', marginBottom: '12px' }}>
                      Select Access Groups ({selectedAccessGroupNames.length} selected)
                    </Form.Label>
                    <div className="border rounded p-3" style={{ maxHeight: '300px', maxWidth: '600px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                      {accessGroups.length === 0 ? (
                        <p className="text-muted mb-0">No access groups available</p>
                      ) : (
                        accessGroups.map((group) => (
                          <Form.Check
                            key={group.name}
                            type="checkbox"
                            id={`group-${group.name}`}
                            label={
                              <div>
                                <strong>{group.name}</strong>
                                {group.description && (
                                  <span className="text-muted small d-block">{group.description}</span>
                                )}
                              </div>
                            }
                            checked={selectedAccessGroupNames.includes(group.name)}
                            onChange={() => handleAccessGroupToggle(group.name)}
                            className="mb-3"
                            style={{ textAlign: 'left' }}
                          />
                        ))
                      )}
                    </div>
                  </Form.Group>

                  {/* Selected Access Groups Members */}
                  {selectedAccessGroups.length > 0 && (
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <Users size={20} className="me-2 text-primary" />
                        <h6 className="mb-0">
                          Members in Selected Groups
                        </h6>
                      </div>

                      {selectedAccessGroups.map((group, groupIndex) => (
                        <div key={group.name} className="mb-4" style={{ textAlign: 'left' }}>
                          <div className="mb-2" style={{ textAlign: 'left' }}>
                            <Badge bg="primary" className="me-2">{group.name}</Badge>
                            <span className="text-muted small">
                              {group.members?.length || 0} {(group.members?.length || 0) === 1 ? 'member' : 'members'}
                            </span>
                          </div>

                          {group.description && (
                            <p className="text-muted small mb-2" style={{ textAlign: 'left' }}>
                              {group.description}
                            </p>
                          )}

                          {group.members && group.members.length > 0 ? (
                            <div className="ms-3">
                              {group.members.map((member, index) => (
                                <div key={index} className="mb-2 pb-2" style={{ borderBottom: index < group.members.length - 1 ? '1px solid #e9ecef' : 'none', textAlign: 'left' }}>
                                  <div className="d-flex align-items-center" style={{ textAlign: 'left' }}>
                                    <strong style={{ fontSize: '0.9rem' }}>
                                      {member.first_name || member.last_name
                                        ? `${member.first_name || ''} ${member.last_name || ''}`.trim()
                                        : 'No name provided'}
                                    </strong>
                                    {member.organization && (
                                      <Badge bg="secondary" className="ms-2" style={{ fontSize: '0.7rem' }}>
                                        {member.organization}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-muted small" style={{ textAlign: 'left' }}>{member.email || 'No email'}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-muted small ms-3">
                              This access group has no members yet.
                            </div>
                          )}
                        </div>
                      ))}
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
                      disabled={updateCatalogDatasetMutation.isPending || selectedAccessGroupNames.length === 0}
                      style={{ backgroundColor: "#0079c2", borderColor: "#0079c2", cursor: 'pointer' }}
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
