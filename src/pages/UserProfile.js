import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import "./PageStyles.css"

import useAuthStore from './stores/AuthStore';


const UserProfile = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const idToken = useAuthStore((state) => state.idToken);

  const [userAttributes, setUserAttributes] = useState({});

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }

    if (idToken) {
      const decodedIdToken = jwtDecode(idToken);
      setUserAttributes(decodedIdToken);
    }

  }, [isLoggedIn, navigate, idToken]);

  const username = userAttributes.email;

  return (
    <Container className="mainContent">
        <Row>
          <Col className='mx-auto mt-5'>
            <h3 style={{"paddingTop": "30px", "paddingBottom": "30px"}}>User Information</h3>
            <p>Email: {username}</p>
          </Col>
        </Row>
      </Container>
  );
}

export default UserProfile;
