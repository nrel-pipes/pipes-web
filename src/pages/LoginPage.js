import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { useInitialAuthContext } from "../context/AuthContext";
import CognitoAuth from "../components/CognitoAuth";

const LoginPage = () => {
  const imageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { setTempPasswordValue } = useInitialAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }

    // Handle login logic here
    try {
      await CognitoAuth.login(username, password)
        .then((result) => {
          if (
            result.hasOwnProperty("new_password_challenge") &&
            result.new_password_challenge === true
          ) {
            setTempPasswordValue(password);
            navigate(`/setup-new-password/${username}`);
          } else {
            navigate("/");
          }
        })
        .catch((error) => {
          setErrorMessage(error);
        });
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <Container fluid className="vh-100">
      <Row>
        {errorMessage && (
          <Alert variant="danger" className="text-center">
            {errorMessage}
          </Alert>
        )}
      </Row>
      <Row style={{ backgroundColor: "#fff" }}>
        <Col
          style={{
            fontSize: "38px",
            color: "#000",
            paddingLeft: "50px",
            paddingTop: "20px",
            paddingBottom: "20px",
            fontWeight: "bold",
          }}
          md={10}
          sm={8}
        >
          PIPES
        </Col>
        <Col md={2} sm={4}>
          <Image
            src="https://brand.nrel.gov/images/logo.svg"
            alt="NREL"
            fluid
          />
        </Col>
      </Row>
      <Row>
        <Col sm={12} style={imageStyle}>
          <Image
            className="rounded"
            src="/images/pipes-transparent-ui-splash.png"
            alt="PIPES"
            style={{ width: "30%" }}
            fluid
          />
        </Col>
      </Row>

      <Row>
        <Col sm={4} className="mx-auto mt-5">
          <h1 className="text-center">Welcome!</h1>
          <Form onSubmit={handleSubmit}>
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
                variant="outline-light"
                size="lg"
                style={{ width: "150px" }}
                type="submit"
              >
                Login
              </Button>
            </div>
            <div className="mt-3 text-center">
              <Link to="https://nrel-pipes.github.io/pipes-core/troubleshooting__faq.html#pipes-team-contacts">
                Don't have an account?
              </Link>{" "}
              | <Link to="/forgot-password">Forgot the password?</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
