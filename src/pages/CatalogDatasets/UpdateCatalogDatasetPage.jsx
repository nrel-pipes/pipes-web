import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import { useGetCatalogDatasetQuery, useUpdateCatalogDatasetMutation } from '../../hooks/useCatalogDatasetQuery';
import NavbarSub from '../../layouts/NavbarSub';
import { useUpdateCatalogDatasetFormStore } from '../../stores/FormStore/CatalogDatasetStore';
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

const UpdateCatalogDatasetPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState([]);
  const navigate = useNavigate();
  const { datasetName } = useParams();
  const updateMutation = useUpdateCatalogDatasetMutation();
  const {
    data: existingDataset,
    isLoading,
    isError,
    error
  } = useGetCatalogDatasetQuery(datasetName);

  // Zustand form store - simple persistence
  const {
    formData: storedFormData,
    updateFormData,
    clearFormData,
    setFormData
  } = useUpdateCatalogDatasetFormStore();

  // Initialize react-hook-form with stored data or defaults
  const methods = useForm({
    mode: 'onChange',
    defaultValues: storedFormData,
  });

  const { handleSubmit, trigger, watch, reset } = methods;

  // Prefill form when dataset is loaded
  useEffect(() => {
    if (existingDataset) {
      const prefilledData = {
        name: existingDataset.name ?? '',
        display_name: existingDataset.display_name ?? '',
        description: existingDataset.description ?? '',
        version: existingDataset.version ?? '',
        previous_version: existingDataset.previous_version ?? '',
        hash_value: existingDataset.hash_value ?? '',
        data_format: existingDataset.data_format ?? '',
        schema_info: existingDataset.schema_info ?? {},
        location: {
          system_type: existingDataset.location?.system_type ?? '',
          storage_path: existingDataset.location?.storage_path ?? '',
          access_info: existingDataset.location?.access_info ?? '',
          extra_note: existingDataset.location?.extra_note ?? '',
        },
        weather_years: existingDataset.weather_years ?? [],
        model_years: existingDataset.model_years ?? [],
        units: existingDataset.units ?? [],
        temporal_info: {
          start_date: existingDataset.temporal_info?.start_date ?? '',
          end_date: existingDataset.temporal_info?.end_date ?? '',
        },
        spatial_info: existingDataset.spatial_info ?? {},
        scenarios: existingDataset.scenarios ?? [],
        sensitivities: existingDataset.sensitivities ?? [],
        source_code: {
          location: existingDataset.source_code?.location ?? '',
          branch: existingDataset.source_code?.branch ?? '',
          tag: existingDataset.source_code?.tag ?? '',
          image: existingDataset.source_code?.image ?? '',
        },
        relevant_links: existingDataset.relevant_links ?? [],
        resource_url: existingDataset.resource_url ?? '',
      };

      // Update Zustand store
      setFormData(prefilledData);

      // Reset react-hook-form with prefilled data
      reset(prefilledData);
    }
  }, [existingDataset, setFormData, reset]);

  // Debounce save function - watch all form values
  useEffect(() => {
    let timer;
    const subscription = watch((value) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        updateFormData({ ...value });
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
        ...data,
        name: data.name?.trim() || datasetName, // Use the possibly updated name
      };

      await updateMutation.mutateAsync({
        datasetName: datasetName,
        data: cleanedFormData
      });

      // Clear stored form data on successful submission
      clearFormData();

      // Reset form to initial values
      reset({});
      setActiveStep(0);

      // Redirect to the new dataset name if it was changed
      const redirectName = cleanedFormData.name?.trim();
      if (redirectName !== datasetName) {
        navigate(`/catalogdataset/${redirectName}`, { state: { updateSuccess: true } });
      } else {
        navigate(`/catalogdataset/${datasetName}`, { state: { updateSuccess: true } });
      }
    } catch (error) {
      setFormError(true);
      setFormErrorMessage('Failed to update dataset in catalog.');

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

      console.error('Error updating catalog dataset:', error);
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

  if (isLoading) {
    return (
      <>
        <NavbarSub navData={{ cdList: true, cdName: datasetName, toUpdate: true }} />
        <Container className="mainContent text-center" fluid>
          <Spinner animation="border" role="status" />
          <p className="mt-3">Loading dataset...</p>
        </Container>
      </>
    );
  }

  if (isError || !existingDataset) {
    return (
      <>
        <NavbarSub navData={{ cdList: true, cdName: datasetName, toUpdate: true }} />
        <Container className="mainContent mt-5">
          <div className="alert alert-danger">
            <h5 className="alert-heading">Error</h5>
            <p>{error?.message || 'Failed to load dataset. The dataset may not exist.'}</p>
            <Button variant="outline-primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavbarSub navData={{ cdList: true, cdName: datasetName, toUpdate: true }} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader title="Update Dataset"/>
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
                          disabled={updateMutation.isPending}
                          className="action-button"
                        >
                          {updateMutation.isPending ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Updating...
                            </>
                          ) : (
                            'Update Dataset'
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

export default UpdateCatalogDatasetPage;
