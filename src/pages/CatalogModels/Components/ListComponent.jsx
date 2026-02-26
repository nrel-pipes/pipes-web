import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFieldArray, useWatch } from "react-hook-form";


const ListComponent = ({name, description, fieldName, required, control, register, errors, watch, setValue, storedData }) => {
  const { fields: featureFields, append: appendElement, remove: removeElement } = useFieldArray({
    control,
    name: fieldName
  });

  const addElement = () => {
    appendElement("");
  };

  const removeElementAt = (index) => {
    removeElement(index);
  };


  return (
    <div className="form-field-group">
      <div className="mb-4">
        <Form.Label className={`form-field-label ${required?'required-field':''}`}>{name}s</Form.Label>
        <Form.Text className="text-muted d-block mb-2">
          {description}
        </Form.Text>

        {featureFields.map((field, index) => (
          <div key={field.id} className="d-flex align-items-center mb-2">
            <Form.Control
              type="text"
              className="form-control-lg form-primary-input me-2"
              placeholder={`Enter ${name}`}
              {...register(`${fieldName}.${index}`, {
                required: `${name} is required`
              })}
              isInvalid={!!errors.features?.[index]}
            />
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => removeElement(index)}
            >
              Remove
            </Button>
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

export default ListComponent;
