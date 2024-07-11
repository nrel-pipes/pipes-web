import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import "./PageStyles.css"

import useAuthStore from './stores/AuthStore';


const UserProfile = () => {
  const navigate = useNavigate();
  const { isLoggedIn, idToken, accessToken, currentUser, getCurrentUser} = useAuthStore();

  // const [userAttributes, setUserAttributes] = useState({});
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }

    if (idToken) {
      const decodedIdToken = jwtDecode(idToken);
      const email = decodedIdToken.email.toLowerCase();
      setUserEmail(email);
    }

    if (userEmail && (!userRole || (currentUser && userEmail !== currentUser.email.toLowerCase()))) {
      getCurrentUser(userEmail, accessToken);
      if (currentUser.is_superuser) {
        setUserRole('Administrator');
      } else {
        setUserRole('User')
      }
    }

  }, [isLoggedIn, navigate, idToken, accessToken, currentUser, getCurrentUser, userEmail, userRole]);

  return (
    <Container className="mainContent">
        <Row>
          <Col className='mx-auto mt-5'>
            <h3 style={{"paddingTop": "30px", "paddingBottom": "30px"}}>User Profile</h3>
            <Table striped bordered hover>
              <tbody className="text-start">
                <tr key='1'>
                  <td><b>Email</b></td>
                  <td>{userEmail}</td>
                </tr>
                <tr key='2'>
                  <td><b>Role</b></td>
                  <td>{userRole}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
  );
}

export default UserProfile;
