import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";


const BasicInfoSection = ({ control, register, errors, watch, setValue, storedData, projectRun}) => {
  return (
    <div className="form-field-group">
      <Form.Label className="form-field-label">
        <span className="form-field-text">Basic Info</span>
      </Form.Label>

      <div className="mb-4">
        <Form.Label className="form-field-label required-field">Model Name</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="Enter model name"
          isInvalid={!!errors.name}
          {...register("name", { required: "Model name is required" })}
        />
        <Form.Control.Feedback type="invalid" className="text-start">
          {errors.name?.message}
        </Form.Control.Feedback>
      </div>

      <div className="mb-4">
        <Form.Label className="form-field-label">Display Name</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="Enter display name (optional)"
          {...register("displayName")}
        />
      </div>
      <div className="mb-4">
        <Form.Label className="form-field-label required-field">Type</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="e.g., Capacity Expansion"
          isInvalid={!!errors.type}
          {...register("type", { required: "Model type is required" })}
        />
        <Form.Control.Feedback type="invalid" className="text-start">
          {errors.type?.message}
        </Form.Control.Feedback>
      </div>
      <div className="mb-4">
        <Form.Label className="form-field-label">Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          className="form-control-lg form-primary-input"
          placeholder="Enter a brief description for the model"
          {...register("description")}
        />
      </div>
      <Row>
        <Col md={6} className="form-field-group">
          <Form.Label className="form-field-label required-field">
            <span className="form-field-text">Scheduled Start</span>
          </Form.Label>
          {projectRun?.scheduled_start && (
            <Form.Text className="text-muted d-block text-start">
              Date must be after{" "}
              {new Date(projectRun.scheduled_start).toLocaleDateString()}
            </Form.Text>
          )}
          <Form.Control
            id="scheduledStart"
            type="date"
            className="form-control-lg form-date-input"
            isInvalid={!!errors.scheduledStart}
            placeholder="mm/dd/yyyy"
            {...register("scheduledStart", {
              required: "Start date is required"
            })}
          />
          {errors.scheduledStart && (
            <Form.Control.Feedback type="invalid">
              {errors.scheduledStart.message}
            </Form.Control.Feedback>
          )}
        </Col>

        <Col md={6} className="form-field-group">
          <Form.Label className="form-field-label required-field">
            <span className="form-field-text">Scheduled End</span>
          </Form.Label>
          {projectRun?.scheduled_end && (
            <Form.Text className="text-muted d-block text-start">
              Date must be before{" "}
              {new Date(projectRun.scheduled_end).toLocaleDateString()}
            </Form.Text>
          )}
          <Form.Control
            id="scheduledEnd"
            type="date"
            className="form-control-lg form-date-input"
            isInvalid={!!errors.scheduledEnd}
            placeholder="mm/dd/yyyy"
            {...register("scheduledEnd", {
              required: "End date is required"
            })}
          />
          {errors.scheduledEnd && (
            <Form.Control.Feedback type="invalid">
              {errors.scheduledEnd.message}
            </Form.Control.Feedback>
          )}
        </Col>
      </Row>
    </div>
  );
}


export default BasicInfoSection;
