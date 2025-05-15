import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import "../PageStyles.css";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";

const Register = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationStep, setVerificationStep] = useState("email");
  const [userEmail, setUserEmail] = useState("");

  const createCognitoUser = useAuthStore((state) => state.createCognitoUser);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors }
  } = useForm({
    mode: "onChange",
  });

  const {
    register: registerCode,
    handleSubmit: handleSubmitCode,
    formState: { errors: codeErrors },
    getValues
  } = useForm({
    mode: "onChange",
  });

  // Handle email submission
  const onSubmitEmail = async (data) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createCognitoUser(data.email.toLowerCase());
      setUserEmail(data.email.toLowerCase());
      setSuccessMessage("Verification code has been sent to your email.");
      setVerificationStep("code");
    } catch (error) {
      console.error("Registration error:", error);

      // Handle other types of errors - user already exists should be handled in createCognitoUser
      setErrorMessage(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle code submission
  const onSubmitCode = async (data) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // We need to add confirmSignUp to useAuthStore
      await useAuthStore.getState().confirmSignUp(userEmail, data.code);
      setSuccessMessage("Email verified successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Verification error:", error);
      setErrorMessage(error.message || "Failed to verify code. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavbarSub />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="p-4 bg-white shadow-sm rounded">
              <h2 className="text-center mb-4">
                {verificationStep === "email" ? "Create an Account" : "Verify Your Email"}
              </h2>

              {errorMessage && (
                <Alert variant="danger" className="mb-4">
                  {errorMessage}
                </Alert>
              )}

              {successMessage && (
                <Alert variant="success" className="mb-4">
                  {successMessage}
                </Alert>
              )}

              {verificationStep === "email" ? (
                // Email submission form
                <Form onSubmit={handleSubmitEmail(onSubmitEmail)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      isInvalid={!!emailErrors.email}
                      {...registerEmail("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {emailErrors.email?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      You'll receive a verification code at this email address.
                    </Form.Text>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </Button>
                </Form>
              ) : (
                // Code verification form
                <Form onSubmit={handleSubmitCode(onSubmitCode)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Verification Code</Form.Label>
                    <Form.Control
                      type="text"
                      isInvalid={!!codeErrors.code}
                      {...registerCode("code", {
                        required: "Verification code is required",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Please enter a valid verification code",
                        },
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {codeErrors.code?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Enter the verification code sent to {userEmail}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      isInvalid={!!codeErrors.password}
                      {...registerCode("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters long",
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                          message: "Password must include uppercase, lowercase, number and special character",
                        },
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {codeErrors.password?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Password must be at least 8 characters with uppercase, lowercase, number and special character.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      isInvalid={!!codeErrors.confirmPassword}
                      {...registerCode("confirmPassword", {
                        required: "Please confirm your password",
                        validate: value => {
                          const password = getValues("password");
                          return password === value || "Passwords do not match";
                        }
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {codeErrors.confirmPassword?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Verifying...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>

                  <div className="text-center">
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => setVerificationStep("email")}
                      disabled={isLoading}
                    >
                      Use a different email address
                    </Button>
                  </div>
                </Form>
              )}

              <div className="text-center mt-3">
                <p>
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => navigate("/login")}
                  >
                    Log in here
                  </Button>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Register;