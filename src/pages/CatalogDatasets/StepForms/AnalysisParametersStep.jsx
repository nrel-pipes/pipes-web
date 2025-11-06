import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Controller, useFormContext } from 'react-hook-form';

const AnalysisParametersStep = () => {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  const [weatherYearsInput, setWeatherYearsInput] = useState('');
  const [modelYearsInput, setModelYearsInput] = useState('');

  const parseYears = (value) => {
    const normalizedValue = value.replace(/\s+/g, ',');
    return normalizedValue.split(',')
      .map(item => parseInt(item.trim()))
      .filter(item => !isNaN(item));
  };

  const handleArrayInput = (fieldName, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setValue(fieldName, items);
  };

  return (
    <Row className="g-3 text-start">
      <Col xs={12}>
        <h6 className="mb-3">Temporal Information</h6>
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="weather_years"
          control={control}
          render={({ field }) => {
            const currentYears = watch('weather_years');
            const displayValue = weatherYearsInput || (currentYears?.join(', ') || '');

            return (
              <Form.Group>
                <Form.Label>Weather Years</Form.Label>
                <Form.Control
                  type="text"
                  value={displayValue}
                  onChange={(e) => {
                    setWeatherYearsInput(e.target.value);
                  }}
                  onBlur={(e) => {
                    const years = parseYears(e.target.value);
                    setValue('weather_years', years);
                    setWeatherYearsInput('');
                  }}
                />
                <Form.Text className="text-muted">
                  Enter years separated by commas or spaces (e.g., 2020, 2021, 2022)
                </Form.Text>
              </Form.Group>
            );
          }}
        />
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="model_years"
          control={control}
          render={({ field }) => {
            const currentYears = watch('model_years');
            const displayValue = modelYearsInput || (currentYears?.join(', ') || '');

            return (
              <Form.Group>
                <Form.Label>Model Years</Form.Label>
                <Form.Control
                  type="text"
                  value={displayValue}
                  onChange={(e) => {
                    setModelYearsInput(e.target.value);
                  }}
                  onBlur={(e) => {
                    const years = parseYears(e.target.value);
                    setValue('model_years', years);
                    setModelYearsInput('');
                  }}
                />
                <Form.Text className="text-muted">
                  Enter years separated by commas or spaces (e.g., 2020, 2021, 2022)
                </Form.Text>
              </Form.Group>
            );
          }}
        />
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="temporal_info.start_date"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                {...field}
                type="date"
                value={field.value ?? ''}
                isInvalid={!!errors.temporal_info?.start_date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.temporal_info?.start_date?.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="temporal_info.end_date"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                {...field}
                type="date"
                value={field.value ?? ''}
                isInvalid={!!errors.temporal_info?.end_date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.temporal_info?.end_date?.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="temporal_info.resolution"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Temporal Resolution</Form.Label>
              <Form.Control {...field} type="text" />
              <Form.Text className="text-muted">
                e.g., hourly, daily, monthly
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12}>
        <hr className="my-4" />
      </Col>

      <Col xs={12}>
        <h6 className="mb-3">Spatial Information</h6>
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="spatial_info.extent"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Spatial Extent</Form.Label>
              <Form.Control {...field} type="text" />
              <Form.Text className="text-muted">
                Geographic coverage (e.g., Global, US, California)
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="spatial_info.resolution"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Spatial Resolution</Form.Label>
              <Form.Control {...field} type="text" />
              <Form.Text className="text-muted">
                e.g., 1km, 0.25°, county-level
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12} md={6}>
        <Controller
          name="spatial_info.coordinate_system"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Coordinate System</Form.Label>
              <Form.Control {...field} type="text" />
              <Form.Text className="text-muted">
                e.g., WGS84, EPSG:4326
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12}>
        <hr className="my-4" />
      </Col>

      <Col xs={12}>
        <h6 className="mb-3">Scenarios & Sensitivities</h6>
      </Col>

      <Col xs={12}>
        <Controller
          name="scenarios"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Scenarios</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={watch('scenarios')?.join(', ') || ''}
                onChange={(e) => handleArrayInput('scenarios', e.target.value)}
              />
              <Form.Text className="text-muted">
                Enter scenario names separated by commas (e.g., baseline, high-growth, low-carbon)
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>

      <Col xs={12}>
        <Controller
          name="sensitivities"
          control={control}
          render={({ field }) => (
            <Form.Group>
              <Form.Label>Sensitivities</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={watch('sensitivities')?.join(', ') || ''}
                onChange={(e) => handleArrayInput('sensitivities', e.target.value)}
              />
              <Form.Text className="text-muted">
                Enter sensitivities separated by commas (e.g., temperature, precipitation, policy)
              </Form.Text>
            </Form.Group>
          )}
        />
      </Col>
    </Row>
  );
};

export default AnalysisParametersStep;
