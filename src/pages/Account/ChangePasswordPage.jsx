import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import "../PageStyles.css";

import NavbarSub from '../../layouts/NavbarSub';
import useAuthStore from '../../stores/AuthStore';


const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const changePassword = useAuthStore((state) => state.changePassword);
  const idToken = useAuthStore((state) => state.idToken);

  const [userAttributes, setUserAttributes] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() =>{
    if (!isLoggedIn) {
      navigate('/login');
    }

    if (idToken) {
      const decodedIdToken = jwtDecode(idToken);
      setUserAttributes(decodedIdToken);
    }
  }, [isLoggedIn, navigate, idToken]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword1 !== newPassword2) {
      setErrorMessage("New passwords do not match, please confirm.");
      return;
    }

    try {
      await changePassword(userAttributes.email, oldPassword, newPassword2)
      setChangeSuccess(true);
    } catch (error) {
      setChangeSuccess(false);
      setErrorMessage(error.message);
    }
  };

  if (changeSuccess) {
    return (
      <div className="text-center" style={{marginTop: "50px"}}>
        <h2>Password changed</h2>
        <p>
          Your password was successfully changed.
        </p>
      </div>
    )
  }

  return (
    <>
    <NavbarSub />
    <Container className="mainContent">
      <Row>
        {errorMessage && <Alert variant="danger" className="text-center main-content">{errorMessage}</Alert>}
      </Row>
      <Row>
        <Col sm={6} className="mx-auto mt-5">
          <h3 className="fw-light" style={{"paddingTop": "30px", "paddingBottom": "30px"}}>Change Password</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="oldpassword" className="mt-3">
            <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                title="Please enter old password"
              />
            </Form.Group>
            <Form.Group controlId="newpassword1" className="mt-3">
            <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword1}
                onChange={(e) => setNewPassword1(e.target.value)}
                required
                title="Please enter new password"
              />
            </Form.Group>
            <Form.Group controlId="newpassword2" className="mt-3">
            <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                required
                title="Please confirm new password"
              />
            </Form.Group>
            <div className="d-flex justify-content-center mt-3">
              <Button
                className="mt-3 custom-green-button"
                variant="primary"
                size="lg"
                style={{
                  width: '150px',
                  backgroundColor: "#5d9732",
                  borderColor: "#5d9732",
                  color: "white"
                }}
                type="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
    </>
  )
}


export default ChangePasswordPage;
