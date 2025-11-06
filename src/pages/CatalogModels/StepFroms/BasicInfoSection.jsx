import Form from "react-bootstrap/Form";


const BasicInfoSection = ({ control, register, errors, watch, setValue, storedData}) => {
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
    </div>
  );
}


export default BasicInfoSection;
