import Form from "react-bootstrap/Form";
import SCHEMAS from "../GetCatalogModelPage";

const MaturitySectionIFAC = ({ control, register, errors, watch, setValue, storedData}) => {
  return (
    <div className="form-field-group">
      <Form.Label className="form-field-label">
        <span className="form-field-text">Maturity Info</span>
      </Form.Label>

      <div className="table-responsive">
        <table className="table">
          <tr>
            <td>
              <div className="mb-4">
                <Form.Label className="form-field-label required-field">Software License</Form.Label>
                <Form.Check
                  type="switch"
                  isInvalid={!!errors.name}
                  {...register("maturity.software_license")}
                />
              </div>
            </td>  
            <td>
              <div className="mb-4">
                <Form.Label className="form-field-label required-field">Publication History</Form.Label>
                <Form.Check
                  type="switch"
                  isInvalid={!!errors.name}
                  {...register("maturity.publication_history")}
                />
              </div>
            </td>  
            <td>
              <div className="mb-4">
                <Form.Label className="form-field-label required-field">Documented External Validation</Form.Label>
                <Form.Check
                  type="switch"
                  isInvalid={!!errors.name}
                  {...register("maturity.external_validation_documented")}
                />
              </div>
            </td>
            <td>
              <div className="mb-4">
                <Form.Label className="form-field-label required-field">Application</Form.Label>
                <Form.Check
                  type="switch"
                  isInvalid={!!errors.name}
                  {...register("maturity.application")}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="mb-4">
                <Form.Label className="form-field-label required-field">External Validation Via Usage</Form.Label>
                <Form.Check
                  type="switch"
                  isInvalid={!!errors.name}
                  {...register("maturity.external_validation_via_usage")}
                />
              </div>
            </td>
            <td>
              <div className="mb-4">
                <Form.Label className="form-field-label required-field">Input/Output Interoperability</Form.Label>
                <Form.Check
                  type="switch"
                  isInvalid={!!errors.name}
                  {...register("maturity.input_output_interoperability")}
                />
              </div>
            </td>
            <td>
              <div className="mb-4">
                <Form.Label className="form-field-label required-field">Public Data Accessability</Form.Label>
                <Form.Check
                  type="switch"
                  isInvalid={!!errors.name}
                  {...register("maturity.data_accessability_public")}
                />
              </div>
            </td>
            <td>
              <div className="mb-4">
                <Form.Label className="form-field-label required-field">Proprietary Data Accessability</Form.Label>
                <Form.Check
                  type="switch"
                  isInvalid={!!errors.name}
                  {...register("maturity.data_accessability_proprietary")}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="mb-4">
                <Form.Label className="form-field-label required-field">Secure for Sensitive Data Handling</Form.Label>
                <Form.Check
                  type="switch"
                  isInvalid={!!errors.name}
                  {...register("maturity.secure_for_sensitive_data_handling")}
                />
              </div>
            </td>
            <td>
              <div className="mb-4">
                <Form.Label className="form-field-label required-field">Secure for Independent Usage</Form.Label>
                <Form.Check
                  type="switch"
                  isInvalid={!!errors.name}
                  {...register("maturity.secure_independent_usage")}
                />
              </div>
            </td>
            <td>
              <div className="mb-4">
                <Form.Label className="form-field-label required-field">Usable via GUI</Form.Label>
                <Form.Check
                  type="switch"
                  isInvalid={!!errors.name}
                  {...register("maturity.usability_via_GUI")}
                />
              </div>
            </td>
            <td>
              <div className="mb-4">
                <Form.Label className="form-field-label required-field">Usable via CLI</Form.Label>
                <Form.Check
                  type="switch"
                  isInvalid={!!errors.name}
                  {...register("maturity.usability_via_CLI")}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="mb-4">
                <Form.Label className="form-field-label required-field">Accessible for External Users</Form.Label>
                <Form.Check
                  type="switch"
                  isInvalid={!!errors.name}
                  {...register("maturity.accessible_for_external_users")}
                />
              </div>
            </td>
            <td>
              <div className="mb-4">
                <Form.Label className="form-field-label required-field">Support Available</Form.Label>
                <Form.Check
                  type="switch"
                  isInvalid={!!errors.name}
                  {...register("maturity.support_available")}
                />
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}


export default MaturitySectionIFAC;
