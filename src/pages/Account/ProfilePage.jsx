import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useGetUserQuery } from '../../hooks/useUserQuery';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import "../PageStyles.css";

import NavbarSub from '../../layouts/NavbarSub';
import useAuthStore from '../../stores/AuthStore';


const ProfilePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, idToken, currentUser, setCurrentUser } = useAuthStore();
  const [userEmail, setUserEmail] = useState(null);

  // Extract email from token for display purposes and for querying
  useEffect(() => {
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
  }, [isLoggedIn, navigate, idToken]);

  // Fetch user details if currentUser is null
  const { data: userDetail, isLoading: isLoadingUserData } = useGetUserQuery(userEmail, {
    enabled: isLoggedIn && !currentUser && !!userEmail
  });

  useEffect(() => {
    if (userDetail && !currentUser) {
      setCurrentUser(userDetail);
    }
  }, [userDetail, currentUser, setCurrentUser]);

  // Determine if data is still loading
  const isLoading = (!currentUser && isLoadingUserData) || !userEmail;

  // Use currentUser if available, otherwise use the newly fetched userDetail
  const userData = currentUser || userDetail;

  // Determine user role from user details
  const userRole = userData?.is_superuser ? 'Administrator' : 'User';

  return (
    <>
    <NavbarSub />
    <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
      <Row>
        <Col className='mx-auto mt-5' md={8} lg={6}>
          <h3 className="fw-light" style={{"paddingTop": "30px", "paddingBottom": "30px"}}>User Profile</h3>

          {isLoading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading user information...</p>
            </div>
          ) : (
            <div className="profile-card shadow-sm rounded p-4 bg-white">
              <div className="text-center mb-4">
                <div className="profile-avatar mb-3">
                  <div className="avatar-circle">
                    {userEmail && userEmail.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="profile-info">
                <div className="info-item d-flex align-items-center mb-3 p-3 rounded bg-light">
                  <div className="info-icon me-3">
                    <i className="bi bi-envelope-fill text-primary"></i>
                  </div>
                  <div className="info-content">
                    <div className="info-label text-muted small">Email Address</div>
                    <div className="info-value">{userEmail || 'Not available'}</div>
                  </div>
                </div>

                <div className="info-item d-flex align-items-center mb-3 p-3 rounded bg-light">
                  <div className="info-icon me-3">
                    <i className="bi bi-person-badge-fill text-primary"></i>
                  </div>
                  <div className="info-content">
                    <div className="info-label text-muted small">Role</div>
                    <div className="info-value">
                      <span className={`badge ${userRole === 'Administrator' ? 'bg-danger' : 'bg-success'}`}>
                        {userRole || 'Not assigned'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default ProfilePage;
