
import React, {useState, useEffect} from 'react';
import {Container, Row, Button} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

import Sidebar from "./Sidebar";
import CognitoAuth from '../components/CognitoAuth';


const LogoutPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() =>{
    // if (!("email" in userAttributes)) {
    //   let attributes = getCognitoUserAttributes()
    //   console.log(attributes, "hi")
    //   if (attributes == null) {
    //     return;
    //   };
    //   attributes.then((attributes) => {
    //     setUserAttributes(attributes);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    // };

    // Check if it is authenticated user
    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }

  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      // Clear user session or perform other logout actions
      await CognitoAuth.logout();
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error('UserLogoutError:', error);
    }
  }

  return (
    <Container>
      <Row>
        <Sidebar />
        <div className="main-content text-center">
          <hr style={{"marginTop": "3rem", "borderColor": "#fff"}}></hr>
          <h4 style={{"paddingTop": "30px"}}>Do you really want to log out?</h4>
          <Button className="mt-3" variant="outline-light" size="lg" style={{ width: '150px' }} onClick={handleLogout}>Logout</Button>
        </div>
      </Row>
    </Container>
  );
};

export default LogoutPage;
