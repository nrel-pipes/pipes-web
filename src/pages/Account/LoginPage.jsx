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
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const validateToken = useAuthStore((state) => state.validateToken);
  const accessToken = useAuthStore((state) => state.accessToken);

  // State for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    validateToken(accessToken);
    if (isLoggedIn) {
      navigate(-1);
    }
  }, [isLoggedIn, navigate, accessToken, validateToken]);

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent the default form submission

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
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  if (isLoggedIn) {
    return (
      <Container>
        <Row>
          <Col className="mx-auto mt-5">
            <p>You are already logged in.</p>
          </Col>
        </Row>
      </Container>
    );
  }

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
          <h1 className="text-center mb-5">Welcome!</h1>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="username">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter user email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                title="Please enter your email"
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                title="Please enter your password"
              />
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button
                className="mt-3 "
                variant="outline-secondary"
                size="lg"
                style={{ width: "150px" }}
                type="submit"
              >
                Login
              </Button>
            </div>
            <div className="mt-3 text-center">
              <Link
                to="https://nrel-pipes.github.io/pipes-core/index.html"
                target="_blank"
              >
                Learn more about PIPES?
              </Link>{" "}
              <Link to="/forgot-password">Forgot the password?</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default LoginPage;
