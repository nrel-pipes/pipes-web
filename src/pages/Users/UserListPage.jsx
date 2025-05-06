import { faEdit, faSearch, faSpinner, faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useGetUserQuery, useGetUsersQuery } from '../../hooks/useUserQuery';
import NavbarSub from '../../layouts/NavbarSub';
import useAuthStore from '../../stores/AuthStore';
import ContentHeader from '../Components/ContentHeader';
import '../PageStyles.css';
import './UserListPage.css';

const UserListPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, idToken, validateToken, currentUser, setCurrentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [userEmail, setUserEmail] = useState(null);

    // Extract email from token for display purposes and for querying
  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (idToken) {
      try {
        const decodedIdToken = jwtDecode(idToken);
        const email = decodedIdToken.email.toLowerCase();
        setUserEmail(email);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [isLoggedIn, navigate, idToken, accessToken, validateToken]);

  // Fetch user details if currentUser is null
  const { data: userData } = useGetUserQuery(userEmail, {
    enabled: isLoggedIn && !currentUser && !!userEmail
  });

  useEffect(() => {
    if (userData && !currentUser) {
      setCurrentUser(userData);
    }
  }, [userData, currentUser, setCurrentUser]);

  // Fetch users with the hook, suppressing the error notification
  const { data: users = [], isLoading, error } = useGetUsersQuery({
    onError: () => {}, // Silent error handling, we'll handle it in UI
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // If we have users, filter them as before
  const filteredUsers = users.filter(user =>
    (user.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.organization?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleEdit = (userEmail) => {
    navigate(`/users/edit/${userEmail}`);
  };

  const handleDelete = (userEmail) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Implement deletion logic here
      console.log(`Delete user with email: ${userEmail}`);
    }
  };

  const handleAddUser = () => {
    navigate('/users/add');
  };

  // Determine if current user is an admin
  const isAdmin = currentUser?.is_superuser === true;

  return (
    <>
      <NavbarSub navData={{ users: true }} />
      <Container className="mainContent" fluid>
        <Row className="w-100 mx-0">
          <ContentHeader title="User Management" />
        </Row>

        {!isAdmin && (
          <Alert variant="warning" className="mt-3">
            <h5>Admin Access Required</h5>
            <p>You need administrator privileges to access the user management functionality.</p>
          </Alert>
        )}

        {error && isAdmin && (
          <Alert variant="danger" className="mt-3">
            <h5>Error Loading Users</h5>
            <p>{error.message}</p>
          </Alert>
        )}

        {isAdmin && !error && (
          <>
            <Row className="my-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </InputGroup>
              </Col>
              <Col md={6} className="text-end">
                <Button variant="primary" onClick={handleAddUser}>
                  <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                  Add User
                </Button>
              </Col>
            </Row>

            {isLoading ? (
              <div className="text-center my-5">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p className="mt-2">Loading users...</p>
              </div>
            ) : (
              <Table striped hover responsive className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Organization</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr key={user.email}>
                        <td>{`${user.first_name || ''} ${user.last_name || ''}`}</td>
                        <td>{user.email}</td>
                        <td>{user.organization || '-'}</td>
                        <td>
                          <span className={`role-badge ${user.is_superuser ? 'role-admin' : 'role-user'}`}>
                            {user.is_superuser ? 'Administrator' : 'User'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(user.email)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(user.email)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No users found matching the search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default UserListPage;
