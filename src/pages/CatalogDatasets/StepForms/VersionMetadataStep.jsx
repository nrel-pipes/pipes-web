import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Controller, useFormContext } from 'react-hook-form';

const VersionMetadataStep = () => {
  const { control, watch, setValue, formState: { errors } } = useFormContext();

  const handleArrayInput = (fieldName, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setValue(fieldName, items);
  };

  return (
    <Row className="g-3 text-start">
      <Col xs={12}>
        <h6 className="mb-3">Version & Format Information</h6>
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="version"
          control={control}
          rules={{ required: 'Version is required' }}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>
                Version <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                {...field}
                type="text"
                isInvalid={!!errors.version}
              />
              <Form.Control.Feedback type="invalid">
                {errors.version?.message}
              </Form.Control.Feedback>
              {!errors.version && (
                <Form.Text className="text-muted">
                  Dataset version (e.g., 1.0.0)
                </Form.Text>
              )}
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="previous_version"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Previous Version</Form.Label>
              <Form.Control {...field} type="text" />
              <Form.Text className="text-muted">
                Previous version of this dataset (if applicable)
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="hash_value"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Hash Value</Form.Label>
              <Form.Control {...field} type="text" />
              <Form.Text className="text-muted">
                Hash value for integrity check
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="data_format"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Data Format</Form.Label>
              <Form.Control {...field} type="text" />
              <Form.Text className="text-muted">
                Data format or comma-separated list (e.g., CSV, Parquet, NetCDF)
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12}>
        <Controller
          name="resource_url"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Resource URL</Form.Label>
              <Form.Control {...field} type="text" />
              <Form.Text className="text-muted">
                URL to access the dataset resource
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12}>
        <hr className="my-4" />
      </Col>

      <Col xs={12}>
        <h6 className="mb-3">Metadata</h6>
      </Col>

      <Col xs={12}>
        <Controller
          name="units"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Units</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => handleArrayInput('units', e.target.value)}
              />
              <Form.Text className="text-muted">
                Enter units separated by commas (e.g., kg, m/s, °C)
              </Form.Text>
              <div className="mt-2 d-flex flex-wrap gap-1">
                {watch('units')?.map((unit, index) => (
                  <Badge key={index} bg="secondary">{unit}</Badge>
                ))}
              </div>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12}>
        <Controller
          name="relevant_links"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Relevant Links</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={(e) => {
                  const links = e.target.value.split(/[,\n]/).map(link => link.trim()).filter(link => link);
                  setValue('relevant_links', links);
                }}
              />
              <Form.Text className="text-muted">
                Enter URLs separated by commas or new lines
              </Form.Text>
              <div className="mt-2 d-flex flex-wrap gap-1">
                {watch('relevant_links')?.map((link, index) => (
                  <Badge key={index} bg="secondary">{link}</Badge>
                ))}
              </div>
            </Form.Group>
          )}
        />
      </Col>
    </Row>
  );
};

export default VersionMetadataStep;
