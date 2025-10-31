import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Controller, useFormContext } from 'react-hook-form';

const SourceCodeStep = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Row className="g-3 text-start">
      <Col xs={12}>
        <h6 className="mb-2">Source Code Information</h6>
        <p className="text-muted small mb-3">
          Information about the code that produced this dataset
        </p>
      </Col>

      <Col xs={12}>
        <Controller
          name="source_code.location"
          control={control}
          rules={{ required: 'Location is required' }}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>
                Location <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                {...field}
                type="text"
                isInvalid={!!errors.source_code?.location}
              />
              <Form.Control.Feedback type="invalid">
                {errors.source_code?.location?.message}
              </Form.Control.Feedback>
              {!errors.source_code?.location && (
                <Form.Text className="text-muted">
                  The location of the source code (e.g., repository URL, file path)
                </Form.Text>
              )}
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="source_code.branch"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Branch</Form.Label>
              <Form.Control {...field} type="text" />
              <Form.Text className="text-muted">
                The git branch of source code
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="source_code.tag"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Tag</Form.Label>
              <Form.Control {...field} type="text" />
              <Form.Text className="text-muted">
                The git tag of source code
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12}>
        <Controller
          name="source_code.image"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Container Image</Form.Label>
              <Form.Control {...field} type="text" />
              <Form.Text className="text-muted">
                The location of container image (e.g., Docker image URL)
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>
    </Row>
  );
};

export default SourceCodeStep;
