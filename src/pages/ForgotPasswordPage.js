import { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import CognitoAuth from "../components/CognitoAuth"
import { Link, useNavigate } from "react-router-dom"


export default function ForgetPasswordPage() {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await CognitoAuth.forgotPassword(username);
      setSuccess(true);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
      setSuccess(false);
    }
  }

  useEffect(() => {
    if (success) {
      navigate(`/reset-password/${username}`);
    }
  });

  return (
    <Container className="vh-100">
      <Row>
        {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
      </Row>
      <Row>
        <Col sm={4} className="mx-auto mt-5">
          <h2 className="text-center">Forgot Password</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Control
                type="text"
                placeholder="Email Address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                title="Please enter your username"
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button className="mt-3 " variant="outline-light" size="lg" style={{ width: '150px' }} type="submit">
                Submit
              </Button>
            </div>
          </Form>
          <div className="mt-3 text-center">
            <Link to="/login">Retry login? Click here</Link>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
