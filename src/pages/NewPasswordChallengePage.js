import { useState } from "react"
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

import { useInitialAuthContext } from '../context/AuthContext';
import CognitoAuth  from "../components/CognitoAuth"


export default function NewPasswordChallengePage() {
  const { email } = useParams();
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { tempPassword } = useInitialAuthContext();

  const navigate = useNavigate();

  const handleNewPasswordChallenge = async (e) => {
    e.preventDefault()

    if (newPassword1 !== newPassword2) {
      setErrorMessage("New passwords do not match, please try again.");
      return;
    }

    try {
      await CognitoAuth.completeNewPasswordChallenge(email, tempPassword, newPassword2)
      setSuccess(true);
      setErrorMessage("");
      navigate("/");
    } catch (err) {
      setSuccess(false);
      setErrorMessage(err.message);
    }
  };

  if (success) {
    return (
      <div className="text-center" style={{marginTop: "50px"}}>
        <div>
          {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
        </div>
        <h2>Password Changed</h2>
        <p>
          Your new password got setup successfully.
        </p>
      </div>
    )
  }

  return (
    <Container className="vh-100">
      <Row>
        {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
      </Row>
      <Row>
        <Col sm={4} className="mx-auto mt-5">
          <h3 className="text-center">Setup New Password</h3>
          <Form onSubmit={handleNewPasswordChallenge}>
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
