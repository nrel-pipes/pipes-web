import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import "../PageStyles.css";

import NavbarSub from '../../layouts/NavbarSub';
import useAuthStore from '../../stores/AuthStore';

const LogoutPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      // Call logout and wait for it to complete
      await logout();

      // Force a hard navigation to /login to ensure state is fresh
      window.location.href = '/login';
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, try to navigate to login
      navigate('/login', { replace: true });
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <>
      <NavbarSub />
      <Container
        className="text-center mainContent align-items-center justify-content-center mt-5"
        style={{"paddingTop": "30px", "paddingBottom": "30px"}}
      >
        <div>
          <h3 className="mb-4 fw-light">Are you sure you want to logout?</h3>
          <div className="mt-5">
            <Button variant="danger" onClick={handleLogout} className="me-2">
              Yes, Logout
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              No, Go Back
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default LogoutPage;
