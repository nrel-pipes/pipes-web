import { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import jwtDecode from 'jwt-decode';
import CognitoAuth  from "../components/CognitoAuth"


export default function ChangePasswordPage() {
  const [idToken, setIdToken] = useState();
  const [accessToken, setAccessToken] = useState("");
  const [userAttributes, setUserAttributes] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() =>{
    const idToken = localStorage.getItem("idToken");
    setIdToken(idToken);
    if (idToken) {
      const decodedIdToken = jwtDecode(idToken);
      setUserAttributes(decodedIdToken);
    }

    const accessToken = localStorage.getItem("accessToken");
    setAccessToken(accessToken);
  }, [idToken, accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword1 !== newPassword2) {
      setErrorMessage("New passwords do not match, please confirm.");
      return;
    }

    try {
      await CognitoAuth.changePassword(userAttributes.email, oldPassword, newPassword2)
      setSuccess(true);
      setErrorMessage("");
    } catch (err) {
      setSuccess(false);
      setErrorMessage(err.message);
    }
  };

  if (success) {
    return (
      <div className="main-content text-center" style={{marginTop: "50px"}}>
        <h2>Password changed</h2>
        <p>
          Your password was successfully changed.
        </p>
      </div>
    )
  }

  return (
    <Container className="vh-100" fluid>
      <Row>
        {errorMessage && <Alert variant="danger" className="text-center main-content">{errorMessage}</Alert>}
      </Row>
      <Row>
        <Col sm={4} className="mx-auto mt-5">
          <h3 className="text-center">Change Password</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="oldpassword">
            <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                title="Please enter old password"
              />
            </Form.Group>
            <Form.Group controlId="newpassword1">
            <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword1}
                onChange={(e) => setNewPassword1(e.target.value)}
                required
                title="Please enter new password"
              />
            </Form.Group>
            <Form.Group controlId="newpassword2">
            <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                required
                title="Please confirm new password"
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button className="mt-3 " variant="outline-light" size="lg" style={{ width: '150px' }} type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}
