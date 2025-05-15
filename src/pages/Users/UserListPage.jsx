import { faEdit, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { jwtDecode } from 'jwt-decode';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import Pagination from "react-bootstrap/Pagination";
import { useNavigate } from 'react-router-dom';

import { useGetUserQuery, useGetUsersQuery } from '../../hooks/useUserQuery';
import NavbarSub from '../../layouts/NavbarSub';
import useAuthStore from '../../stores/AuthStore';
import ContentHeader from '../Components/ContentHeader';
import '../PageStyles.css';
import './UserListPage.css';

const UserListPage = () => {
  const navigate = useNavigate();
  const { checkAuthStatus, getIdToken, currentUser, setCurrentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [userEmail, setUserEmail] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(25); // Adjust this number based on your preference

  // Extract email from token for display purposes and for querying
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const isAuthenticated = await checkAuthStatus();

        if (!isAuthenticated) {
          navigate('/login');
          return;
        }

        // Get token and extract email
        const idToken = await getIdToken();
        if (idToken) {
          try {
            const decodedIdToken = jwtDecode(idToken);
            const email = decodedIdToken.email.toLowerCase();
            setUserEmail(email);
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, checkAuthStatus, getIdToken]);

  // Fetch user details if currentUser is null
  const { data: userData } = useGetUserQuery(userEmail, {
    enabled: !!userEmail && !currentUser
  });

  useEffect(() => {
    if (userData && !currentUser) {
      setCurrentUser(userData);
    }
  }, [userData, currentUser, setCurrentUser]);

  const { data: users = [], isLoading, error } = useGetUsersQuery({
    onError: () => {},
  });

  // Sort users by is_superuser first (admins at top), then by email
  const sortedUsers = [...users].sort((a, b) => {
    // First sort by is_superuser (true values first)
    if (a.is_superuser !== b.is_superuser) {
      return b.is_superuser ? 1 : -1; // b is admin and a is not? b comes first (1)
    }
    // Then sort by email alphabetically
    return (a.email || '').localeCompare(b.email || '');
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const filteredUsers = sortedUsers.filter(user =>
    (user.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.organization?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Then calculate pagination based on filtered results
  const totalUsers = filteredUsers?.length || 0;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  // Apply pagination to filtered users
  const currentFilteredUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // Custom styles for larger pagination buttons - same as ProjectListPage
  const paginationItemStyle = {
    fontSize: '1.1rem',
    minWidth: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const activePageStyle = {
    ...paginationItemStyle,
    backgroundColor: '#0079c2',
    borderColor: '#0079c2'
  };

  const handleEdit = (userEmail) => {
    navigate(`/users/edit/${userEmail}`);
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
                    <th>Email</th>
                    <th>Name</th>
                    <th>Organization</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFilteredUsers.length > 0 ? (
                    currentFilteredUsers.map(user => (
                      <tr key={user.email}>
                        <td>{user.email}</td>
                        <td>{`${user.first_name || ''} ${user.last_name || ''}`}</td>
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

            {/* Add pagination controls */}
            {totalPages > 1 && !isLoading && (
              <div className="pagination-container d-flex justify-content-center mt-4 mb-5">
                <Pagination size="lg">
                  <Pagination.Prev
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={paginationItemStyle}
                  >
                    <ChevronLeft size={20} />
                  </Pagination.Prev>

                  {/* First page */}
                  {currentPage > 2 && (
                    <Pagination.Item
                      onClick={() => handlePageChange(1)}
                      style={paginationItemStyle}
                    >1</Pagination.Item>
                  )}

                  {/* Ellipsis if needed */}
                  {currentPage > 3 && <Pagination.Ellipsis disabled style={paginationItemStyle} />}

                  {/* Page before current */}
                  {currentPage > 1 && (
                    <Pagination.Item
                      onClick={() => handlePageChange(currentPage - 1)}
                      style={paginationItemStyle}
                    >
                      {currentPage - 1}
                    </Pagination.Item>
                  )}

                  {/* Current page */}
                  <Pagination.Item
                    active
                    style={activePageStyle}
                  >
                    {currentPage}
                  </Pagination.Item>

                  {/* Page after current */}
                  {currentPage < totalPages && (
                    <Pagination.Item
                      onClick={() => handlePageChange(currentPage + 1)}
                      style={paginationItemStyle}
                    >
                      {currentPage + 1}
                    </Pagination.Item>
                  )}

                  {/* Ellipsis if needed */}
                  {currentPage < totalPages - 2 && <Pagination.Ellipsis disabled style={paginationItemStyle} />}

                  {/* Last page */}
                  {currentPage < totalPages - 1 && (
                    <Pagination.Item
                      onClick={() => handlePageChange(totalPages)}
                      style={paginationItemStyle}
                    >
                      {totalPages}
                    </Pagination.Item>
                  )}

                  <Pagination.Next
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={paginationItemStyle}
                  >
                    <ChevronRight size={20} />
                  </Pagination.Next>
                </Pagination>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default UserListPage;
