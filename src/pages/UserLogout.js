import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import "./PageStyles.css"

import useConfigStore from './stores/configStore';
import useAuthStore from './stores/authStore';

const Logout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const poolData = useConfigStore((state) => state.poolData);

  const handleLogout = () => {
    logout(poolData);
    navigate('/login');
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <Container className="text-center mainContent">
      <h3 style={{"paddingTop": "30px", "paddingBottom": "30px"}}>Are you sure you want to logout?</h3>
      <div className="mt-3">
        <Button variant="danger" onClick={handleLogout} className="me-2">
          Yes, Logout
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          No, Go Back
        </Button>
      </div>
    </Container>
  );
};

export default Logout;
