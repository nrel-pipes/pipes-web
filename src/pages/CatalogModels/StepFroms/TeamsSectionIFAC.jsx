
import { useEffect, useState } from "react";

import { Minus, Plus } from "lucide-react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";


// TeamsSection for model creation
const TeamsSectionIFAC = ({ control, register, errors, watch, setValue, storedData }) => {
  // Use storedData for initial state if present and not empty
  const initialTeams = (storedData.teams || []).length > 0
    ? storedData.teams.reduce((accumulator,currentValue) => {
      accumulator[currentValue['name']] = currentValue;
      return accumulator;
    }, {})
    : { };

  const [teams, setTeams] = useState(initialTeams);
  const [teamIds, setTeamIds] = useState(Object.keys(initialTeams));

  // Prefill from zustand store if available when mounting or when storedData changes
  useEffect(() => {
    if (Object.keys(storedData.teams || {}).length > 0) {
      setTeams(storedData.teams);
      setTeamIds(Object.keys(storedData.teams));
      setValue("teams", storedData.teams);
    }
  }, [storedData, setValue]);

  const addTeam = () => {
    const timestamp = Date.now();
    const newId = `req_${timestamp}`;
    const newTeams = {
      ...teams,
      [newId]: {
        lab: "",
        role: "",
        contact: ""
      }
    };
    setTeams(newTeams);
    setValue("teams", newTeams);
    setTeamIds([...teamIds, newId]);
  };

  const removeTeam = (id) => {
    const { [id]: removed, ...rest } = teams;
    setTeams(rest);
    setValue("teams", rest);
    setTeamIds(teamIds.filter(reqId => reqId !== id));
  };

  const updateTeamName = (id, newName) => {
    const newTeams = {
      ...teams,
      [id]: {
        ...teams[id],
        name: newName
      }
    };
    setTeams(newTeams);
    setValue("teams", newTeams);
  };

  const updateTeamValue = (id, key, value) => {
    const newTeams = {
      ...teams,
      [id]: {
        ...teams[id],
        [key]: value
      }
    };
    setTeams(newTeams);
    setValue("teams", newTeams);
  };

  return (
    <div className="form-field-group">
      <Form.Label className="form-field-label">
        <span className="form-field-text">Teams</span>
      </Form.Label>
      <div>
        {teamIds.map((id, idx) => {
          const teamData = teams[id];
          if (!teamData) return null;
          return (
            <div key={id} className="mb-4 border p-3 rounded">
              <Row className="mb-2">
                <Col>
                  <Form.Label className="small fw-bold">National Lab</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      className="form-control-lg form-primary-input"
                      placeholder="Lab"
                      value={teamData.lab || ""}
                      onChange={(e) => updateTeamValue(id, "lab", e.target.value)}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      type="button"
                      onClick={() => removeTeam(id)}
                      className="d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "38px", padding: "4px" }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </Col>
              </Row>
              <Form.Label className="small fw-bold">Role</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="developer"
                value={teamData.role || ""}
                onChange={(e) => updateTeamValue(id, 'role', e.target.value)}
              />
              <Form.Label className="small fw-bold">Contact</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="example@email.com"
                value={teamData.contact || ""}
                onChange={(e) => updateTeamValue(id, 'contact', e.target.value)}
              />
            </div>
          );
        })}
        <div className="d-flex justify-content-start mt-2">
          <Button
            variant="outline-primary"
            type="button"
            onClick={addTeam}
            className="d-flex align-items-center me-2"
            style={{ padding: "0.5rem 1rem" }}
          >
            <Plus className="mr-1" size={16} />
            Team
          </Button>
        </div>
      </div>
    </div>
  );
};


export default TeamsSectionIFAC;
