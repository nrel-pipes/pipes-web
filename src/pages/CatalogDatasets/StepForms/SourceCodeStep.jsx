import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Controller, useFormContext } from 'react-hook-form';

const SourceCodeStep = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Row className="g-3 text-start">
      <Col xs={12}>
        <h6 className="mb-2">Source Code</h6>
        <p className="text-muted small mb-3">
          Information about the code that produced this dataset
        </p>
      </Col>

      <Col xs={12}>
        <Controller
          name="source_code.location"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>
                Location
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

      <hr className="my-5" />

      <Col xs={12}>
        <Controller
          name="source_code.image"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control {...field} type="text" />
              <Form.Text className="text-muted">
                The location of container image built from the code (e.g., DockerHub image URL, AWS ECR ARN)
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>
    </Row>
  );
};

export default SourceCodeStep;
