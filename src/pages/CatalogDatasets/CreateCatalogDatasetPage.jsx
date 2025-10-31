import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import { useCreateCatalogDatasetMutation } from '../../hooks/useCatalogDatasetQuery';
import NavbarSub from '../../layouts/NavbarSub';
import { useCreateCatalogDatasetFormStore } from '../../stores/FormStore/CatalogDatasetStore';
import ContentHeader from '../Components/ContentHeader';

import AnalysisParametersStep from './StepForms/AnalysisParametersStep';
import BasicInfoStep from './StepForms/BasicInfoStep';
import ReviewStep from './StepForms/ReviewStep';
import SourceCodeStep from './StepForms/SourceCodeStep';
import VersionMetadataStep from './StepForms/VersionMetadataStep';

import './CreateCatalogDatasetPage.css';

const steps = [
  'Basic Information',
  'Version & Metadata',
  'Analysis Parameters',
  'Source Code',
  'Review',
];


const CreateCatalogDatasetPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState([]);
  const navigate = useNavigate();
  const createMutation = useCreateCatalogDatasetMutation();

  // Zustand form store - simple persistence
  const {
    formData: storedFormData,
    updateFormData,
    clearFormData,
  } = useCreateCatalogDatasetFormStore();

  // Initialize react-hook-form with stored data or defaults
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: storedFormData.name ?? '',
      display_name: storedFormData.display_name ?? '',
      description: storedFormData.description ?? '',
      version: storedFormData.version ?? '',
      previous_version: storedFormData.previous_version ?? '',
      hash_value: storedFormData.hash_value ?? '',
      data_format: storedFormData.data_format ?? '',
      schema_info: {
        ...(storedFormData.schema_info ?? {})
      },
      location: {
        ...(storedFormData.location ?? {})
      },
      weather_years: storedFormData.weather_years ?? [],
      model_years: storedFormData.model_years ?? [],
      units: storedFormData.units ?? [],
      temporal_info: {
        start_date: storedFormData.temporal_info?.start_date ?? '',
        end_date: storedFormData.temporal_info?.end_date ?? '',
      },
      spatial_info: {
        ...(storedFormData.spatial_info ?? {})
      },
      scenarios: storedFormData.scenarios ?? [],
      sensitivities: storedFormData.sensitivities ?? [],
      source_code: {
        location: storedFormData.source_code?.location ?? '',
        branch: storedFormData.source_code?.branch ?? '',
        tag: storedFormData.source_code?.tag ?? '',
        image: storedFormData.source_code?.image ?? '',
      },
      relevant_links: storedFormData.relevant_links ?? [],
      resource_url: storedFormData.resource_url ?? '',
    },
  });

  const { handleSubmit, trigger, watch, reset } = methods;

  // Debounce save function - watch all form values
  useEffect(() => {
    let timer;
    const subscription = watch((value) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        updateFormData({
          name: value.name ?? '',
          display_name: value.display_name ?? '',
          description: value.description ?? '',
          version: value.version ?? '',
          previous_version: value.previous_version ?? '',
          hash_value: value.hash_value ?? '',
          data_format: value.data_format ?? '',
          schema_info: value.schema_info ?? {},
          location: value.location ?? {},
          weather_years: value.weather_years ?? [],
          model_years: value.model_years ?? [],
          units: value.units ?? [],
          temporal_info: {
            start_date: value.temporal_info?.start_date ?? '',
            end_date: value.temporal_info?.end_date ?? '',
          },
          spatial_info: value.spatial_info ?? {},
          scenarios: value.scenarios ?? [],
          sensitivities: value.sensitivities ?? [],
          source_code: {
            location: value.source_code?.location ?? '',
            branch: value.source_code?.branch ?? '',
            tag: value.source_code?.tag ?? '',
            image: value.source_code?.image ?? '',
          },
          relevant_links: value.relevant_links ?? [],
          resource_url: value.resource_url ?? '',
        });
      }, 1000);
    });
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [watch, updateFormData]);

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setFormError(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setFormError(false);
  };

  const handleFormKeyDown = (e) => {
    // Prevent Enter key from submitting the form on non-final steps
    if (e.key === 'Enter' && activeStep !== steps.length - 1) {
      e.preventDefault();
      return false;
    }
  };

  const handleFinalSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      // Manually get form data and call onSubmit
      const data = methods.getValues();
      await onSubmit(data);
    }
  };

  const onSubmit = async (data) => {
    // Prevent submission if not on the final step
    if (activeStep !== steps.length - 1) {
      return;
    }

    try {
      setFormError(false);
      setFormErrorMessage('');
      setErrorDetails([]);

      // Clean and format data for API
      const cleanedFormData = {
        name: data.name.trim(),
        display_name: data.display_name?.trim() || null,
        description: data.description?.trim() || '',
        version: data.version.trim(),
        previous_version: data.previous_version?.trim() || null,
        hash_value: data.hash_value?.trim() || '',
        data_format: data.data_format?.trim() || null,
        schema_info: data.schema_info || {},
        location: data.location || {},
        weather_years: data.weather_years || [],
        model_years: data.model_years || [],
        units: data.units || [],
        temporal_info: data.temporal_info || {},
        spatial_info: data.spatial_info || {},
        scenarios: data.scenarios || [],
        sensitivities: data.sensitivities || [],
        source_code: data.source_code || {},
        relevant_links: data.relevant_links || [],
        resource_url: data.resource_url?.trim() || '',
      };

      await createMutation.mutateAsync(cleanedFormData);

      // Clear stored form data on successful submission
      clearFormData();

      // Reset form to initial values
      reset({
        name: '',
        display_name: '',
        description: '',
        version: '',
        previous_version: '',
        hash_value: '',
        data_format: '',
        schema_info: {},
        location: {},
        weather_years: [],
        model_years: [],
        units: [],
        temporal_info: {},
        spatial_info: {},
        scenarios: [],
        sensitivities: [],
        source_code: {
          location: '',
          branch: '',
          tag: '',
          image: '',
        },
        relevant_links: [],
        resource_url: '',
      });
      setActiveStep(0);

      navigate('/catalogdatasets');
    } catch (error) {
      setFormError(true);
      setFormErrorMessage('Failed to create dataset in catalog.');

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
        setErrorDetails([error.message || 'An unexpected error occurred']);
      }

      console.error('Error creating catalog dataset:', error);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <BasicInfoStep />;
      case 1:
        return <VersionMetadataStep />;
      case 2:
        return <AnalysisParametersStep />;
      case 3:
        return <SourceCodeStep />;
      case 4:
        return <ReviewStep />;
      default:
        return 'Unknown step';
    }
  };

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <>
      <NavbarSub navData={{ cdList: true, toCreate: true }} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader title="Create Dataset"/>
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

            <div className="px-3 py-3">
              <div className="step-form-container">
                <div className="progress-wrapper">
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-striped"
                      role="progressbar"
                      style={{ width: `${progress}%` }}
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
                <ul className="nav nav-pills nav-justified step-nav">
                  {steps.map((step, index) => (
                    <li key={index} className="nav-item">
                      <button
                        type="button"
                        onClick={() => index < activeStep && setActiveStep(index)}
                        className={`nav-link ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''} ${index < activeStep ? 'clickable' : 'disabled'}`}
                        disabled={index > activeStep}
                      >
                        {step}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="step-content">
                <FormProvider {...methods}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onKeyDown={handleFormKeyDown}
                    noValidate
                  >
                    <div className="form-container">
                      <div className="step-panel" style={{ width: '80%', margin: '0 auto' }}>
                        {getStepContent(activeStep)}
                      </div>
                    </div>

                    <div className="mt-5 d-flex justify-content-between form-action-buttons">
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        className="action-button"
                      >
                        Previous
                      </Button>

                      {activeStep !== steps.length - 1 ? (
                        <Button
                          style={{ backgroundColor: "#0079c2", borderColor: "#0079c2" }}
                          variant="primary"
                          type="button"
                          onClick={handleNext}
                          className="action-button"
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          style={{ backgroundColor: "#0079c2", borderColor: "#0079c2" }}
                          variant="primary"
                          type="button"
                          onClick={handleFinalSubmit}
                          disabled={createMutation.isPending}
                          className="action-button"
                        >
                          {createMutation.isPending ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Creating...
                            </>
                          ) : (
                            'Create Dataset'
                          )}
                        </Button>
                      )}
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateCatalogDatasetPage;
