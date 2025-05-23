import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import "../PageStyles.css";

import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from '../../stores/AuthStore';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const forgotPassword = useAuthStore((state) => state.forgotPassword);

  const [username, setUsername] = useState("");
  const [codeRequestSuccess, setCodeRequestSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (codeRequestSuccess) {
      navigate('/account/reset-password');
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await forgotPassword(username);
      setCodeRequestSuccess(true);
    } catch (error) {
      setErrorMessage(error.message);
      setCodeRequestSuccess(false);
    }
  }

  return (
    <>
    <NavbarSub />
    <Container className="mainContent">
      <Row>
        {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
      </Row>
      <Row>
        <Col sm={4} className="mx-auto mt-5">
          <h2 className="text-center">Forgot Password</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username" className="my-3">
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
              <Button
                className="mt-3 w-100 py-2"
                variant="success"
                size="lg"
                type="submit"
              >
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
    </>
  )
}

export default ForgotPasswordPage;
