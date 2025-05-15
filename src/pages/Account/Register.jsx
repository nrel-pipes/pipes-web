import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { postUser } from "../../hooks/useUserQuery";
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
import { useQueryClient, useMutation } from "@tanstack/react-query";
import AxiosInstance from "../../hooks/AxiosInstance";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { initiateEmailAuth } = useAuthStore();
  const queryClient = useQueryClient();

  // React-query mutation for user registration
  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      console.log(JSON.stringify(userData));
      // Return the promise and await it
      return await initiateEmailAuth(userData.email);
    },
    onSuccess: (data) => {
      navigate("/login");
    },
    onError: (error) => {
      setErrorMessage(
        error.response?.data?.message || "An error occurred during sign up"
      );
    }
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
  });
  const password = watch("password", "");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      registerMutation.mutate({
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      });
    } finally {
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
              <h2 className="text-center mb-4">Create an Account</h2>

              {errorMessage && (
                <Alert variant="danger" className="mb-4">
                  {errorMessage}
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
                </Form.Group>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
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
                      Creating Account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none">
                    Log in here
                  </Link>
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
