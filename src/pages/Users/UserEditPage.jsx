import { faArrowLeft, faSave, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetUserQuery, useUserUpdateMutation } from '../../hooks/useUserQuery';
import NavbarSub from '../../layouts/NavbarSub';
import useAuthStore from '../../stores/AuthStore';
import ContentHeader from '../Components/ContentHeader';
import '../PageStyles.css';
import './UserEditPage.css';

const UserEditPage = () => {
  const navigate = useNavigate();
  const { userEmail } = useParams();
  const { isLoggedIn, accessToken, validateToken, currentUser } = useAuthStore();
  const [submitStatus, setSubmitStatus] = useState({ status: null, message: '' });
  const queryClient = useQueryClient();

  // Setup react-hook-form with validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      organization: '',
      is_superuser: false,
      is_active: true
    }
  });

  // Fetch user data
  const { data: userData, isLoading, error } = useGetUserQuery(userEmail, {
    enabled: isLoggedIn && !!userEmail
  });

  // Add the update user mutation
  const { mutate: updateUser, isLoading: isUpdating } = useUserUpdateMutation({
    onSuccess: () => {
      setSubmitStatus({
        status: 'success',
        message: 'User information updated successfully!'
      });

      // Invalidate and refetch queries
      queryClient.invalidateQueries(['current-user', userEmail]);
      queryClient.invalidateQueries(['users-list']);

      // Redirect after successful submission
      setTimeout(() => navigate('/users'), 1500);
    },
    onError: (error) => {
      setSubmitStatus({
        status: 'error',
        message: error.response?.data?.detail || 'Failed to update user information. Please try again.'
      });
    }
  });

  // Determine if current user is an admin
  const isAdmin = currentUser?.is_superuser === true;

  // Redirect if not logged in or if not an admin
  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      navigate('/users');
      return;
    }
  }, [isLoggedIn, navigate, accessToken, validateToken, isAdmin]);

  // Set form values when user data is loaded
  useEffect(() => {
    if (userData) {
      reset({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        organization: userData.organization || '',
        is_superuser: userData.is_superuser || false,
        is_active: userData.is_active || false
      });
    }
  }, [userData, reset]);

  // Form submission handler
  const onSubmit = async (data) => {
    // Remove email from the payload since it's passed separately
    const { email, ...userData } = data;

    // Call the mutation with the user data
    updateUser({
      email: userEmail,
      userData: userData
    });
  };

  const handleCancel = () => {
    navigate('/users');
  };

  if (!isAdmin) {
    return (
      <Container className="mainContent" fluid>
        <Alert variant="warning">
          <p>You don't have permission to edit user information.</p>
          <Button variant="primary" onClick={() => navigate('/users')}>
            Back to Users
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <NavbarSub navData={{ users: true }} />
      <Container className="mainContent" fluid>
        <Row className="w-100 mx-0">
          <ContentHeader title="Edit User" />
        </Row>

        <Row className="mt-3 mb-4">
          <Col>
            <Button
              variant="outline-secondary"
              className="px-3 d-flex align-items-center"
              onClick={handleCancel}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Users
            </Button>
          </Col>
        </Row>

        {isLoading ? (
          <div className="text-center my-5 py-5">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <p className="mt-3 text-muted">Loading user information...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="mx-auto" style={{ maxWidth: '800px' }}>
            <Alert.Heading>Error Loading User</Alert.Heading>
            <p>{error.message || 'Could not load user information. Please try again later.'}</p>
          </Alert>
        ) : (
          <Row>
            <Col>
              <Card className="shadow-sm border-0 mb-5" style={{ transition: 'none' }}>
                <Card.Header className="bg-light py-3" style={{ transition: 'none' }}>
                  <div className="d-flex align-items-center">
                    <div className="user-avatar bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: '40px', height: '40px' }}>
                      <FontAwesomeIcon icon={faUser} className="text-white" />
                    </div>
                    <div>
                      <h5 className="mb-0">{userData?.first_name || ''} {userData?.last_name || ''}</h5>
                      <small className="text-muted">{userData?.email || ''}</small>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="p-4" style={{ transition: 'none' }}>
                  {submitStatus.status && (
                    <Alert
                      variant={submitStatus.status === 'success' ? 'success' : 'danger'}
                      className="mb-4"
                    >
                      {submitStatus.message}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* Personal Information Section */}
                    <h6 className="text-primary mb-3">Personal Information</h6>

                    <div className="mb-4">
                      <Row className="mb-3">
                        <Form.Group as={Row}>
                          <Form.Label column sm={3} className="text-end fw-medium text-dark">
                            First Name
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Control
                              type="text"
                              placeholder="Enter first name"
                              {...register('first_name', {
                                maxLength: {
                                  value: 100,
                                  message: 'First name cannot exceed 100 characters'
                                }
                              })}
                              isInvalid={!!errors.first_name}
                            />
                            {errors.first_name && (
                              <Form.Control.Feedback type="invalid">
                                {errors.first_name.message}
                              </Form.Control.Feedback>
                            )}
                          </Col>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group as={Row}>
                          <Form.Label column sm={3} className="text-end fw-medium text-dark">
                            Last Name
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Control
                              type="text"
                              placeholder="Enter last name"
                              {...register('last_name', {
                                maxLength: {
                                  value: 100,
                                  message: 'Last name cannot exceed 100 characters'
                                }
                              })}
                              isInvalid={!!errors.last_name}
                            />
                            {errors.last_name && (
                              <Form.Control.Feedback type="invalid">
                                {errors.last_name.message}
                              </Form.Control.Feedback>
                            )}
                          </Col>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group as={Row}>
                          <Form.Label column sm={3} className="text-end fw-medium text-dark">
                            Email Address
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Control
                              type="email"
                              className="bg-light"
                              {...register('email')}
                              disabled
                            />
                            <Form.Text className="text-muted">
                              Email address cannot be changed as it's used as a unique identifier.
                            </Form.Text>
                          </Col>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group as={Row}>
                          <Form.Label column sm={3} className="text-end fw-medium text-dark">
                            Organization
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Control
                              type="text"
                              placeholder="Enter organization name"
                              {...register('organization', {
                                maxLength: {
                                  value: 200,
                                  message: 'Organization name cannot exceed 200 characters'
                                }
                              })}
                              isInvalid={!!errors.organization}
                            />
                            {errors.organization && (
                              <Form.Control.Feedback type="invalid">
                                {errors.organization.message}
                              </Form.Control.Feedback>
                            )}
                          </Col>
                        </Form.Group>
                      </Row>
                    </div>

                    {/* Permissions Section */}
                    <h6 className="text-primary mb-3 border-top pt-4">User Permissions</h6>

                    <div className="mb-4">
                      <Row className="mb-3">
                        <Form.Group as={Row}>
                          <Form.Label column sm={3} className="text-end fw-medium text-dark">
                            Administrator
                          </Form.Label>
                          <Col sm={9} className="d-flex align-items-center">
                            <Form.Check
                              type="switch"
                              id="is-superuser-switch"
                              {...register('is_superuser')}
                            />
                            <Form.Text className="text-muted ms-2">
                              Full access to all features including user management.
                            </Form.Text>
                          </Col>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group as={Row}>
                          <Form.Label column sm={3} className="text-end fw-medium text-dark">
                            Active Account
                          </Form.Label>
                          <Col sm={9} className="d-flex align-items-center">
                            <Form.Check
                              type="switch"
                              id="is-active-switch"
                              {...register('is_active')}
                            />
                            <Form.Text className="text-muted ms-2">
                              Allow user to log in to the system.
                            </Form.Text>
                          </Col>
                        </Form.Group>
                      </Row>
                    </div>

                    <div className="d-flex justify-content-end gap-2 border-top pt-4">
                      <Button
                        variant="light"
                        className="px-4"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        className="px-4"
                        disabled={isUpdating || !isDirty}
                      >
                        {isUpdating ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faSave} className="me-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default UserEditPage;
