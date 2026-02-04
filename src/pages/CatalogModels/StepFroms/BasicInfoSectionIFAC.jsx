import Form from "react-bootstrap/Form";
import SCHEMAS from "../GetCatalogModelPage";

const BasicInfoSectionIFAC = ({ control, register, errors, watch, setValue, storedData}) => {
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
          placeholder="Enter tool name"
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
          placeholder="Enter a brief description for the tool"
          {...register("description")}
        />
      </div>
      <div className="mb-4">
        <Form.Label className="form-field-label">Source</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="Link to tool source code or other source information"
          {...register("source")}
        />
      </div>
      <div className="mb-4">
        <Form.Label className="form-field-label">Version</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="v1.0"
          {...register("version")}
        />
      </div>
      <div className="mb-4">
        <Form.Label className="form-field-label">Branch</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="main"
          {...register("branch")}
        />
      </div>
      <div className="mb-4">
        <Form.Label className="form-field-label">Documentation</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="Link to tool documentation"
          {...register("documentation")}
        />
      </div>
      <div className="mb-4">
        <Form.Label className="form-field-label">Training</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="Link to tool training material"
          {...register("training")}
        />
      </div>
    </div>
  );
}


export default BasicInfoSectionIFAC;
