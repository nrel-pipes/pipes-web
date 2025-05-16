import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import "../PageStyles.css";

import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  // State for auth status, username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = async () => {
      const isAuthenticated = await checkAuthStatus();

      if (isAuthenticated) {
        navigate("/projects");
      }
    };

    checkAuth();
  }, [checkAuthStatus, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }

    try {
      const response = await login(username, password);

      if (
        response.hasOwnProperty("newPasswordChallenge") &&
        response.newPasswordChallenge === true
      ) {
        navigate("/new-password-challenge");
        return;
      }

      // Use window.location for a hard navigation instead of React Router's navigate
      // This helps avoid the throttling issue with rapid navigation
      window.location.href = "/projects";
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <>
      <NavbarSub />
      <Container className="mainContent">
        <Row>
          {errorMessage && (
            <Alert variant="danger" className="text-center">
              {errorMessage}
            </Alert>
          )}
        </Row>

        <Row>
          <Col sm={4} className="mx-auto mt-5">
            <h1 className="text-center mb-5">Account Login</h1>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="username" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  title="Please enter your email"
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  title="Please enter your password"
                />
              </Form.Group>

              <div className="d-flex justify-content-center">
                <Button
                  className="mt-3 py-2"
                  variant="success"
                  size="lg"
                  type="submit"
                  style={{ width: "100%" }}
                >
                  Login
                </Button>
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="https://nrel-pipes.github.io/pipes-core/index.html"
                  target="_blank"
                >
                  Learn more about PIPES?
                </Link>{" "}
                <Link to="/account/forgot-password">Forgot the password?</Link>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginPage;
