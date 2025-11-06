import { Trash } from "lucide-react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useFieldArray } from "react-hook-form";


const ModelingTeamSection = ({ control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "modelingTeam.members",
  });

  return (
    <div className="form-field-group">
      {/* Team Name */}
      <Form.Group as={Row} className="mb-4 align-items-center" controlId="modelingTeamName">
        <Form.Label column sm={2} className="form-field-label required-field">
          Team Name
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            placeholder="Enter the modeling team name"
            className="form-control-lg form-primary-input"
            {...register("modelingTeam.name", { required: "Team name is required" })}
            isInvalid={!!errors.modelingTeam?.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.modelingTeam?.name?.message}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      {/* Team Members */}
      <Form.Label className="form-field-label mb-3">Team Members</Form.Label>
      {fields.map((item, index) => (
        <div key={item.id} className="member-entry mb-4 p-3 border rounded">
          <Row className="g-3">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="member@example.com"
                  {...register(`modelingTeam.members.${index}.email`)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Organization</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Member's organization"
                  {...register(`modelingTeam.members.${index}.organization`)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First name"
                  {...register(`modelingTeam.members.${index}.first_name`)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={5}>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last name"
                  {...register(`modelingTeam.members.${index}.last_name`)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={1} className="d-flex align-items-end">
              <Button
                variant="outline-danger"
                onClick={() => remove(index)}
                className="w-100"
                style={{ height: 'calc(1.5em + .75rem + 2px)' }}
              >
                <Trash size={16} />
              </Button>
            </Col>
          </Row>
        </div>
      ))}

      <Button
        type="button"
        variant="outline-primary"
        onClick={() => append({ email: "", first_name: "", last_name: "", organization: "" })}
      >
        + Add Member
      </Button>
    </div>
  );
};

export default ModelingTeamSection;
