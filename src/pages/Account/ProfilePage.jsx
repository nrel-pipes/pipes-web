import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import "../PageStyles.css";

import { useUserDetailQuery } from '../../hooks/useUserQuery';
import NavbarSub from '../../layouts/NavbarSub';
import useAuthStore from '../../stores/AuthStore';


const ProfilePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, idToken } = useAuthStore();

  const [userEmail, setUserEmail] = useState(null);

  // Extract email from token
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (idToken) {
      const decodedIdToken = jwtDecode(idToken);
      const email = decodedIdToken.email.toLowerCase();
      setUserEmail(email);
    }
  }, [isLoggedIn, navigate, idToken]);

  // Fetch user details with React Query
  const { data: currentUser, isLoading } = useUserDetailQuery(userEmail);

  // Determine user role
  const userRole = currentUser?.is_superuser ? 'pipes administrator' : 'pipes user';

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
