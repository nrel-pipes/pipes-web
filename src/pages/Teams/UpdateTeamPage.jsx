import { Minus, Plus } from "lucide-react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";
import ContentHeader from "../Components/ContentHeader";
import "../FormStyles.css";
import "../PageStyles.css";

import { useEffect, useState } from "react";
import { useGetTeamQuery, useUpdateTeamMutation } from "../../hooks/useTeamQuery";

// Members component for managing team members
const MembersSection = ({ control, register, errors, watch, setValue }) => {
  const [members, setMembers] = useState([]);

  // Watch the members field
  const watchedMembers = watch("members", []);

  useEffect(() => {
    setMembers(watchedMembers);
  }, [watchedMembers]);

  const addMember = () => {
    const newMember = {
      email: "",
      first_name: "",
      last_name: "",
      organization: ""
    };
    const newMembers = [...members, newMember];
    setMembers(newMembers);
    setValue("members", newMembers);
  };

  const removeMember = (index) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
    setValue("members", newMembers);
  };

  const updateMember = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index] = {
      ...newMembers[index],
      [field]: value
    };
    setMembers(newMembers);
    setValue("members", newMembers);
  };

  return (
    <div className="form-field-group">
      <Form.Label className="form-field-label">
        <span className="form-field-text">Team Members</span>
      </Form.Label>
      <div>
        {members.length > 0 && members.map((member, index) => (
          <div key={index} className="mb-4 border p-3 rounded">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">Member {index + 1}</h6>
              <Button
                variant="outline-danger"
                size="sm"
                type="button"
                onClick={() => removeMember(index)}
                className="d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px", padding: "4px" }}
              >
                <Minus size={16} />
              </Button>
            </div>

            {/* Email */}
            <div className="mb-3">
              <Form.Label className="small fw-bold required-field">Email</Form.Label>
              <Form.Control
                type="email"
                className="form-control-lg form-primary-input"
                placeholder="user@example.com"
                value={member.email || ""}
                onChange={(e) => updateMember(index, "email", e.target.value)}
                isInvalid={!!errors.members?.[index]?.email}
              />
              {errors.members?.[index]?.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.members[index].email.message}
                </Form.Control.Feedback>
              )}
            </div>

            {/* First Name */}
            <div className="mb-3">
              <Form.Label className="small fw-bold">First Name</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="First name"
                value={member.first_name || ""}
                onChange={(e) => updateMember(index, "first_name", e.target.value)}
                isInvalid={!!errors.members?.[index]?.first_name}
              />
              {errors.members?.[index]?.first_name && (
                <Form.Control.Feedback type="invalid">
                  {errors.members[index].first_name.message}
                </Form.Control.Feedback>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <Form.Label className="small fw-bold">Last Name</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="Last name"
                value={member.last_name || ""}
                onChange={(e) => updateMember(index, "last_name", e.target.value)}
                isInvalid={!!errors.members?.[index]?.last_name}
              />
              {errors.members?.[index]?.last_name && (
                <Form.Control.Feedback type="invalid">
                  {errors.members[index].last_name.message}
                </Form.Control.Feedback>
              )}
            </div>

            {/* Organization */}
            <div className="mb-0">
              <Form.Label className="small fw-bold">Organization</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="Organization"
                value={member.organization || ""}
                onChange={(e) => updateMember(index, "organization", e.target.value)}
                isInvalid={!!errors.members?.[index]?.organization}
              />
              {errors.members?.[index]?.organization && (
                <Form.Control.Feedback type="invalid">
                  {errors.members[index].organization.message}
                </Form.Control.Feedback>
              )}
            </div>
          </div>
        ))}
        <div className="d-flex justify-content-start mt-2">
          <Button
            variant="outline-primary"
            type="button"
            onClick={addMember}
            className="d-flex align-items-center me-2"
            style={{ padding: "0.5rem 1rem" }}
          >
            <Plus className="mr-1" size={16} />
            Add Member
          </Button>
        </div>
      </div>
    </div>
  );
};

const UpdateTeamPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuthStatus } = useAuthStore();
  const { effectivePname } = useDataStore();

  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);

  // Get team name from URL params
  const searchParams = new URLSearchParams(location.search);
  const projectName = searchParams.get('project');
  const teamName = searchParams.get('team');

  const currentProjectName = projectName || effectivePname;

  // Get existing team data
  const { data: team, isLoading: teamLoading, error: teamError } = useGetTeamQuery(
    currentProjectName,
    teamName,
    { enabled: !!teamName }
  );

  // Initialize react-hook-form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
    clearErrors,
    reset
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      members: []
    }
  });

  const mutation = useUpdateTeamMutation();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (!isAuthenticated) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, checkAuthStatus]);

  // Populate form with existing team data
  useEffect(() => {
    if (team) {
      reset({
        name: team.name || "",
        description: team.description || "",
        members: team.members || []
      });
    }
  }, [team, reset]);

  // Redirect if no team name
  useEffect(() => {
    if (!teamName) {
      navigate('/teams');
    }
  }, [teamName, navigate]);

  const validateTeamName = (name) => {
    if (!name || name.trim() === "") {
      return "Team name is required";
    }
    return true;
  };

  const validateMembers = (members) => {
    if (!members || members.length === 0) {
      return true;
    }

    for (let i = 0; i < members.length; i++) {
      const member = members[i];

      if (!member.email || member.email.trim() === "") {
        return `Email is required for member ${i + 1}`;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(member.email)) {
        return `Valid email is required for member ${i + 1}`;
      }
    }

    return true;
  };

  const onSubmit = async (data) => {
    clearErrors();
    setFormError(false);
    setFormErrorMessage("");
    setErrorDetails([]);

    // Clean and format data for API
    const formData = { ...data };

    formData.name = data.name.trim();
    formData.description = data.description?.trim() || "";

    formData.members = data.members
      .filter(member => member.email && member.email.trim() !== "")
      .map(member => ({
        email: member.email.trim().toLowerCase(),
        first_name: member.first_name?.trim() || null,
        last_name: member.last_name?.trim() || null,
        organization: member.organization?.trim() || null
      }));

    const membersValidation = validateMembers(formData.members);
    if (membersValidation !== true) {
      setFormError(true);
      setFormErrorMessage(membersValidation);
      return;
    }

    const cleanedFormData = {
      name: formData.name,
      description: formData.description || null,
      members: formData.members.map(member => ({
        email: member.email,
        first_name: member.first_name,
        last_name: member.last_name,
        organization: member.organization
      }))
    };

    try {
      const result = await mutation.mutateAsync({
        projectName: currentProjectName,
        teamName: teamName,
        teamData: cleanedFormData
      });

      // Navigate to the updated team detail page using the new team name
      const newTeamName = result?.name || cleanedFormData.name;
      navigate(`/teams?project=${encodeURIComponent(currentProjectName)}&team=${encodeURIComponent(newTeamName)}`);
    } catch (error) {
      setFormError(true);
      setFormErrorMessage("Failed to update team");

      if (error.response?.data?.message) {
        setFormErrorMessage(error.response.data.message);
      }

      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          setErrorDetails(error.response.data.detail.map(detail =>
            typeof detail === 'object' ? JSON.stringify(detail) : detail
          ));
        } else {
          setErrorDetails([error.response.data.detail]);
        }
      } else {
        setErrorDetails([error.message || "An unexpected error occurred"]);
      }

      if (error.response?.data?.fields) {
        Object.entries(error.response.data.fields).forEach(([field, message]) => {
          setError(field, { message });
        });
      }
    }
  };

  // Show loading state
  if (teamLoading) {
    return (
      <>
        <NavbarSub navData={{ pList: true, pName: currentProjectName, tList: true }} />
        <Container className="mainContent">
          <Row className="mt-5">
            <Col>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading team details...</p>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  // Show error state
  if (teamError || !team) {
    return (
      <>
        <NavbarSub navData={{ pList: true, pName: currentProjectName, tList: true }} />
        <Container className="mainContent">
          <Row className="mt-5">
            <Col>
              <div className="alert alert-danger">
                <h5>Error</h5>
                <p>{teamError?.message || 'Failed to load team details. The team may not exist.'}</p>
                <Button variant="outline-primary" onClick={() => navigate('/teams')}>
                  Go Back to Teams
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavbarSub navData={{ pList: true, pName: currentProjectName, tList: true, tName: teamName, toUpdate:true }} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader title={`Update Team: ${team.name}`} />
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

            <div className="px-3 py-5">
              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-container">
                  <div className="mb-4">
                    <Form.Label className="form-field-label required-field">
                      <span className="form-field-text">Team Name</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg form-primary-input"
                      placeholder="Enter team name"
                      isInvalid={!!errors.name}
                      {...register("name", {
                        required: "Team name is required",
                        validate: validateTeamName
                      })}
                    />
                    {errors.name && (
                      <Form.Control.Feedback type="invalid" className="text-start">
                        {errors.name.message}
                      </Form.Control.Feedback>
                    )}
                  </div>

                  <div className="mb-4">
                    <Form.Label className="form-field-label">
                      <span className="form-field-text">Description</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-lg form-primary-input"
                      placeholder="Enter team description"
                      {...register("description")}
                    />
                  </div>

                  <MembersSection
                    control={control}
                    register={register}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                  />
                </div>

                <div className="mt-4 d-flex justify-content-end form-action-buttons">
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => navigate(`/teams?project=${encodeURIComponent(currentProjectName)}&team=${encodeURIComponent(teamName)}`)}
                    className="action-button me-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ backgroundColor: "#0079c2", borderColor: "#0079c2" }}
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className="action-button"
                  >
                    {isSubmitting ? "Updating Team..." : "Update Team"}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UpdateTeamPage;
