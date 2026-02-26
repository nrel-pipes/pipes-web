import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFieldArray, useWatch } from "react-hook-form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";



const KeyValueDictComponent = ({name, description, fieldName, control, register, errors, watch, setValue, storedData }) => {
  const { fields: featureFields, append: appendElement, remove: removeElement } = useFieldArray({
    control,
    name: fieldName
  });

  const addElement = () => {
    appendElement({'key':'','value':''});
  };

  const removeElementAt = (index) => {
    removeElement(index);
  };


  return (
    <div className="form-field-group">
      <div className="mb-4">
        <Form.Label className="form-field-label">{name}s</Form.Label>
        <Form.Text className="text-muted d-block mb-2">
          {description}
        </Form.Text>

        {featureFields.map((field, index) => (
          <div key={field.id} className="mb-4 border p-3 rounded">
            <Row className="mb-2">
            <Col>
              <Form.Label className="small fw-bold">Key</Form.Label>
              <div className="d-flex align-items-center mb-2">
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input me-2"
                  placeholder={`Enter ${name} key`}
                  {...register(`${fieldName}.${index}.key`, {
                    required: `${name} key is required`
                  })}
                  isInvalid={!!errors.features?.[index].key}
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeElement(index)}
                >
                  Remove
                </Button>
              </div>
            </Col></Row>
            <Row className="mb-2">
              <Col>
              <Form.Label className="small fw-bold">Value</Form.Label>
              <div className="d-flex align-items-center mb-2">
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input me-2"
                  placeholder={`Enter ${name} value`}
                  {...register(`${fieldName}.${index}.value`, {
                    required: `${name} value is required`
                  })}
                  isInvalid={!!errors.features?.[index].value}
                />
              </div>
            </Col></Row>
            </div>
        ))}

        <Button
          variant="outline-primary"
          size="sm"
          onClick={addElement}
          className="mt-2"
        >
          + Add {name}
        </Button>
      </div>
    </div>
  );
};

export default KeyValueDictComponent;
