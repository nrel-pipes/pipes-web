import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Controller, useFormContext } from 'react-hook-form';

const BasicInfoStep = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Row className="g-3 text-start">
      <Col xs={12}>
        <h6 className="mb-3">Basic Information</h6>
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Dataset name is required' }}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>
                Dataset Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                {...field}
                type="text"
                isInvalid={!!errors.name}
                value={field.value ?? ''}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
              {!errors.name && (
                <Form.Text className="text-muted">
                  Short name for the dataset
                </Form.Text>
              )}
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="display_name"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                {...field}
                type="text"
                value={field.value ?? ''}
              />
              <Form.Text className="text-muted">
                Human-readable display name
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                {...field}
                as="textarea"
                rows={4}
                value={field.value ?? ''}
              />
              <Form.Text className="text-muted">
                Detailed description of the dataset
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12}>
        <hr className="my-4" />
      </Col>

      <Col xs={12}>
        <h6 className="mb-2">Dataset Location</h6>
        <p className="text-muted small mb-3">
          Specify where the dataset is stored on the data system
        </p>
      </Col>

      <Col xs={12}>
        <Controller
          name="location.system_type"
          control={control}
          rules={{ required: 'System type is required' }}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>
                System Type <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                {...field}
                type="text"
                isInvalid={!!errors.location?.system_type}
                value={field.value ?? ''}
              />
              <Form.Control.Feedback type="invalid">
                {errors.location?.system_type?.message}
              </Form.Control.Feedback>
              {!errors.location?.system_type && (
                <Form.Text className="text-muted">
                  The data system of the dataset location (e.g., AWS S3, HPC storage, Data Foundry, Github Repo, etc.)
                </Form.Text>
              )}
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12}>
        <Controller
          name="location.storage_path"
          control={control}
          rules={{ required: 'Storage path is required' }}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>
                Storage Path <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                {...field}
                type="text"
                isInvalid={!!errors.location?.storage_path}
                value={field.value ?? ''}
              />
              <Form.Control.Feedback type="invalid">
                {errors.location?.storage_path?.message}
              </Form.Control.Feedback>
              {!errors.location?.storage_path && (
                <Form.Text className="text-muted">
                  Storage path to the dataset within the data system
                </Form.Text>
              )}
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12}>
        <Controller
          name="location.access_info"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Access Info</Form.Label>
              <Form.Control
                {...field}
                as="textarea"
                rows={2}
                value={field.value ?? ''}
              />
              <Form.Text className="text-warning">
                Please do not input sensitive information here, such as credentials, secret keys, etc.
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12}>
        <Controller
          name="location.extra_note"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Extra Note</Form.Label>
              <Form.Control
                {...field}
                as="textarea"
                rows={2}
                value={field.value ?? ''}
              />
              <Form.Text className="text-muted">
                Any extra note about the dataset location
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>
    </Row>
  );
};

export default BasicInfoStep;
