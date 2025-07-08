import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from '../../stores/AuthStore';


const RegisterPage = () => {
  const { register: formRegister, handleSubmit, formState: { errors }, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const navigate = useNavigate();

  const { register, confirmRegister, resendConfirmationCode, checkAuthStatus } = useAuthStore();

  const password = watch('password', '');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await checkAuthStatus();

        if (isAuthenticated) {
          navigate('/');
          return;
        }
      } catch (error) {
        console.error("Authentication check error:", error);
      }
    };

    checkAuth();
  }, [checkAuthStatus, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setRegisterError('');

    try {
      // Use email instead of username for registration
      await register(data.email, data.password, data.email);
      setIsRegistered(true);
      setUserEmail(data.email);
    } catch (error) {
      console.error('Registration error:', error);

      // Check if this is an "already exists" error
      if (error.message && error.message.includes('An account with the given email already exists')) {
        // Try to determine if the account is confirmed or not by attempting to resend the code
        try {
          await resendConfirmationCode(data.email);
          // If resend works, the account exists but is NOT confirmed
          setUserEmail(data.email);
          setIsRegistered(true);
        } catch (resendError) {
          console.error('Error resending code:', resendError);

          // If the error contains "User cannot be confirmed" or similar, it's already confirmed
          if (resendError.message && (
              resendError.message.includes("User cannot be confirmed") ||
              resendError.message.includes("User is already confirmed") ||
              resendError.message.includes("Invalid verification") ||
              resendError.message.includes("Cannot reset password")
          )) {
            // The account is already confirmed, show proper error message
            setRegisterError('An account with this email already exists, please login.');
          } else {
            // Some other error with the resend, but account may still be unconfirmed
            setUserEmail(data.email);
            setIsRegistered(true);
            setConfirmError('We couldn\'t automatically resend a confirmation code. Please try the resend button below.');
          }
        }
      } else {
        setRegisterError(error.message || 'An error occurred during registration');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setConfirmError('');

    try {
      // Use email instead of username for confirmation
      await confirmRegister(userEmail, confirmationCode);
      navigate('/login', { state: { message: 'Account confirmed! You can now log in.' } });
    } catch (error) {
      console.error('Confirmation error:', error);
      setConfirmError(error.message || 'Error confirming account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);

    try {
      // Use email instead of username for resending code
      await resendConfirmationCode(userEmail);
      alert('Confirmation code has been resent to your email');
    } catch (error) {
      console.error('Error resending code:', error);
      setConfirmError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <>
      <NavbarSub />
      <Container className="mx-auto mt-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="p-4 bg-white rounded">
              <h4 className="text-center mb-4">Confirm Your Account</h4>
              <p className="text-center mb-4">
                Please check your email for a confirmation code and enter it below.
              </p>

              {confirmError && (
                <Alert variant="danger" className="mb-4">
                  {confirmError}
                </Alert>
              )}

              <Form onSubmit={handleConfirmation}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Confirmation Code"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant="success"
                  type="submit"
                  size="lg"
                  className="w-100 mt-3 py-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Confirming...' : 'Confirm Account'}
                </Button>

                <div className="text-center mt-4">
                  <Button
                    variant="link"
                    onClick={handleResendCode}
                    disabled={isLoading}
                  >
                    Resend confirmation code
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      </>
    );
  }

  return (
    <>
    <NavbarSub />
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <div className="p-4 bg-white rounded">
            <h1 className="text-center mb-4">Create an Account</h1>

            {registerError && (
              <Alert variant="danger" className="mb-4">
                {registerError}
              </Alert>
            )}

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  isInvalid={!!errors.email}
                  {...formRegister('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <Form.Control.Feedback type="invalid">
                    {errors.email.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  isInvalid={!!errors.password}
                  {...formRegister('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                    }
                  })}
                />
                {errors.password && (
                  <Form.Control.Feedback type="invalid">
                    {errors.password.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  isInvalid={!!errors.confirmPassword}
                  {...formRegister('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                />
                {errors.confirmPassword && (
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Button
                variant="success"
                type="submit"
                size="lg"
                className="w-100 mt-4 py-2"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <span className="text-muted">Already have an account? </span>
              <Link to="/login">Log in</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default RegisterPage;
