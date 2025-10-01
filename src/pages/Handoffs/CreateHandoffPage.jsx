import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { useCreateHandoffMutation } from '../../hooks/useHandoffQuery';
import { useGetModelsQuery } from '../../hooks/useModelQuery';
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from "../Components/ContentHeader";


function CreateHandoffPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectName = searchParams.get("P");
  const projectRunName = searchParams.get("p");

  const { checkAuthStatus } = useAuthStore();

  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const { data: modelsData = [], isLoading, error } = useGetModelsQuery(projectName, projectRunName);
  const createHandoffMutation = useCreateHandoffMutation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await checkAuthStatus();

        if (!isAuthenticated) {
          navigate("/login");
          return;
        }
      } catch (error) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, checkAuthStatus]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm();

  const selectedFromModel = watch('from_model');

  const onSubmit = async (data) => {
    try {
      setFormError(false);
      setFormErrorMessage('');
      setErrorDetails([]);

      const formattedData = {
        ...data,
        scheduled_start: data.scheduled_start ? new Date(data.scheduled_start).toISOString() : null,
        scheduled_end: data.scheduled_end ? new Date(data.scheduled_end).toISOString() : null,
        submission_date: data.submission_date ? new Date(data.submission_date).toISOString() : null,
      };

      await createHandoffMutation.mutateAsync({
        projectName,
        projectRunName,
        data: formattedData
      });

      reset();
      navigate(`/projectrun/${projectRunName}?P=${projectName}`);
    } catch (error) {
      setFormError(true);
      setFormErrorMessage('Failed to create handoff');
      setErrorDetails([error.message || 'An unexpected error occurred']);
    }
  };

  return (
    <>
      <NavbarSub navData={{ pList: true, pName: projectName, prName: projectRunName, hCreate: true }} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader title="Add Handoff" />
        </Row>

        <Row className="g-0">
          <Col>
            {formError && (
              <div className="error-container mb-4 text-start">
                <div className="alert alert-danger">
                  <h5 className="alert-heading text-start">{formErrorMessage}</h5>
                  {errorDetails.length > 0 && (
                    <div className="mt-2">
                      <ul className="error-details-list mb-0 ps-3">
                        {errorDetails.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Col>
        </Row>

        <Row className="g-0">
          <Col>
            <div className="p-4 mb-4 bg-white rounded shadow-sm">
              <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="form-field-group">
                  <div className="mb-4">
                    <Form.Label className="form-field-label required-field">Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg form-primary-input"
                      placeholder="Enter handoff name"
                      isInvalid={!!errors.name}
                      {...register("name", { required: "Name is required" })}
                    />
                    <Form.Control.Feedback type="invalid" className="text-start">
                      {errors.name?.message}
                    </Form.Control.Feedback>
                  </div>

                  <Row>
                    <Col md={6} className="form-field-group">
                      <Form.Label className="form-field-label required-field">From Model</Form.Label>
                      <Form.Select
                        className="form-control-lg form-primary-input"
                        isInvalid={!!errors.from_model}
                        {...register("from_model", { required: "From model is required" })}
                      >
                        <option value="">Select from model</option>
                        {modelsData.map((model) => (
                          <option key={model.name} value={model.name}>
                            {model.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" className="text-start">
                        {errors.from_model?.message}
                      </Form.Control.Feedback>
                    </Col>

                    <Col md={6} className="form-field-group">
                      <Form.Label className="form-field-label required-field">To Model</Form.Label>
                      <Form.Select
                        className="form-control-lg form-primary-input"
                        isInvalid={!!errors.to_model}
                        {...register("to_model", { required: "To model is required" })}
                      >
                        <option value="">Select to model</option>
                        {modelsData
                          .filter((model) => model.name !== selectedFromModel)
                          .map((model) => (
                            <option key={model.name} value={model.name}>
                              {model.name}
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" className="text-start">
                        {errors.to_model?.message}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>

                  <div className="mb-4">
                    <Form.Label className="form-field-label required-field">Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-lg form-primary-input"
                      placeholder="Enter a brief description"
                      {...register("description", { required: "Handoff description is required" })}
                    />
                  </div>

                  <Row>
                    <Col md={6} className="form-field-group">
                      <Form.Label className="form-field-label">
                        Scheduled Start
                      </Form.Label>
                      <Form.Control
                        type="date"
                        className="form-control-lg form-date-input"
                        {...register("scheduled_start")}
                      />
                    </Col>

                    <Col md={6} className="form-field-group">
                      <Form.Label className="form-field-label">
                        Scheduled End
                      </Form.Label>
                      <Form.Control
                        type="date"
                        className="form-control-lg form-date-input"
                        {...register("scheduled_end")}
                      />
                    </Col>
                  </Row>
                </div>

                <div className="d-flex gap-2 pt-3">
                  <button
                    type="submit"
                    style={{
                      backgroundColor: isHovered ? "rgb(59, 130, 196)" : "rgb(71, 148, 218)",
                      fontWeight: "bold",
                      color: "rgba(255, 255, 255)",
                      transition: "background-color 0.2s ease"
                    }}
                    className="btn btn-primary"
                    disabled={createHandoffMutation.isPending}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {createHandoffMutation.isPending ? "Creating..." : "Create Handoff"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(`/projectrun/${projectRunName}?P=${projectName}`)}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default CreateHandoffPage;
