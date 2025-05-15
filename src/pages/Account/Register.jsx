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
import { CognitoUserPool, CognitoUserAttribute } from "amazon-cognito-identity-js";
import pipesConfig from "../../configs/PipesConfig";

// Add this function to generate a secure random password
const generateSecurePassword = (length = 16) => {
  // Create character sets
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  // Generate a random array of bytes
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);

  // Start with one character from each required character set
  let password = '';
  password += uppercaseChars[randomValues[0] % uppercaseChars.length];
  password += lowercaseChars[randomValues[1] % lowercaseChars.length];
  password += numberChars[randomValues[2] % numberChars.length];
  password += specialChars[randomValues[3] % specialChars.length];

  // Fill the rest with random characters from all sets
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  for (let i = 4; i < length; i++) {
    password += allChars[randomValues[i] % allChars.length];
  }

  // Shuffle the password (Fisher-Yates algorithm)
  const passwordArray = password.split('');
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor((randomValues[i] / 255) * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join('');
};

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const createUser = async (email) => {
    const userPool = new CognitoUserPool(pipesConfig.poolData);

    const password = generateSecurePassword();

    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
    ];

    console.log('Creating Cognito User with email:', email);

    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          console.error('Cognito UserPool Sign-up Error:', err);
          reject(err);
        } else {
          console.log('Cognito UserPool Sign-up Success:', result);
          resolve(result);
        }
      });
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createUser(data.email.toLowerCase());
      console.log("Here");
      // If successful, show success message and navigate to login
      setSuccessMessage("Registration successful. Please check your email for your temporary password.");

      // Navigate to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.error("Registration error:", error);

      // Check if the error is related to an existing user
      if (error.code === 'UsernameExistsException' ||
          error.message?.includes('already exists') ||
          error.message?.includes('exists')) {
        setErrorMessage("User with email already exists, navigating to login.");

        // Navigate to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // Handle other types of errors
        setErrorMessage(error.message || "Registration failed");
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <NavbarSub />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="p-4 bg-white shadow-sm rounded">
              <h2 className="text-center mb-4">Create an Account</h2>

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

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    isInvalid={!!errors.email}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    You'll receive a temporary password at this email address.
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
