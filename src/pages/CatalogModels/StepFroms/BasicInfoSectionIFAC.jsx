import Form from "react-bootstrap/Form";
import SCHEMAS from "../GetCatalogModelPage";

const BasicInfoSectionIFAC = ({ control, register, errors, watch, setValue, storedData}) => {
  return (
    <div className="form-field-group">
      <Form.Label className="form-field-label">
        <span className="form-field-text">Basic Info</span>
      </Form.Label>

      <div className="mb-4">
        <Form.Label className="form-field-label required-field">Tool Name</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="Enter tool name"
          isInvalid={!!errors.name}
          {...register("name", { required: "Tool name is required" })}
        />
        <Form.Control.Feedback type="invalid" className="text-start">
          {errors.name?.message}
        </Form.Control.Feedback>
      </div>

      <div className="mb-4">
        <Form.Label className="form-field-label required-field">Display Name</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="Enter display name (optional)"
          isInvalid={!!errors.display_name}
          {...register("displayName", { required: "Tool display name is required" })}
        />
        <Form.Control.Feedback type="invalid" className="text-start">
          {errors.display_name?.message}
        </Form.Control.Feedback>
      </div>
      <div className="mb-4">
        <Form.Label className="form-field-label required-field">Type</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="e.g., Capacity Expansion"
          isInvalid={!!errors.type}
          {...register("type", { required: "Tool type is required" })}
        />
        <Form.Control.Feedback type="invalid" className="text-start">
          {errors.type?.message}
        </Form.Control.Feedback>
      </div>
      <div className="mb-4">
        <Form.Label className="form-field-label required-field">Primary Organization</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="Primary steward organization for this tool (e.g. NLR, ANL)"
          isInvalid={!!errors.prime_organization}
          {...register("prime_organization", { required: "Primary organization is required" })}
        />
        <Form.Control.Feedback type="invalid" className="text-start">
          {errors.prime_organization?.message}
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
        <Form.Label className="form-field-label">Website</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="Link to tool website"
          {...register("website")}
        />
      </div>
      <div className="mb-4">
        <Form.Label className="form-field-label">DOI</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="Software DOI (e.g. 'https://doi.org/10.11578/dc.20210101')"
          {...register("doi")}
        />
      </div>
      <div className="mb-4">
        <Form.Label className="form-field-label">Software Type</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="DOE Code software type (e.g. 'Open Source, Publicly Available Repository (OS-PAR), Open Source, No Publicly Available Repository (OS-NPAR), Closed Source (CS))."
          {...register("software_type")}
        />
      </div>
      <div className="mb-4">
        <Form.Label className="form-field-label">License Type</Form.Label>
        <Form.Control
          type="text"
          className="form-control-lg form-primary-input"
          placeholder="SPDX license identifier (e.g. 'BSD-3-Clause', 'Apache-2.0')"
          {...register("license_type")}
        />
      </div>
    </div>
  );
}


export default BasicInfoSectionIFAC;
