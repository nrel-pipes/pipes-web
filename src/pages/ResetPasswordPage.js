import { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import CognitoAuth from "../components/CognitoAuth"
import { Link, useNavigate, useParams } from "react-router-dom"


export default function ResetPasswordPage() {
  const { email } = useParams();
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword1 !== newPassword2) {
      setErrorMessage("New passwords do not match, please confirm.");
      return;
    }

    try {
      await CognitoAuth.resetPassword(email, verificationCode, newPassword2);
      setSuccess(true);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
      setSuccess(false);
    }
  }

  useEffect(() => {
    if (success) {
      navigate('/login');
    }
  });

  return (
    <Container className="vh-100">
      <Row>
        {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
      </Row>
      <Row>
        <Col sm={4} className="mx-auto mt-5">
          <h2 className="text-center">Reset Password</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="verificationcode">
              <Form.Label>Verification Code</Form.Label>
              <Form.Control
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                title="Please enter your verification code"
              />
            </Form.Group>
            <Form.Group controlId="newpassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword1}
                onChange={(e) => setNewPassword1(e.target.value)}
                required
                title="Please enter your new password"
              />
            </Form.Group>
            <Form.Group controlId="newpassword2">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                required
                title="Please confirm your new password"
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button className="mt-3 " variant="outline-light" size="lg" style={{ width: '150px' }} type="submit">
                Submit
              </Button>
            </div>
            <div className="mt-3 text-center">
              <Link to="/forgot-password">Request a code again? Click here</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}
