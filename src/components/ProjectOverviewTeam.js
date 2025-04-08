import React from "react";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const ProjectOverviewTeam = ({ team }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formTeams, setFormTeams] = useState([""]);

  const handleClose = () => {
    setShowModal(false);
    setFormTeams([""]); // Reset form when closing
  };

  const handleShow = () => {
    setShowModal(true);
    setFormTeams([""]); // Initialize with one empty team
  };

  const handleTeamChange = (index, value) => {
    setFormTeams((prevTeams) =>
      prevTeams.map((item, i) => (i === index ? value : item)),
    );
  };

  const handleAddTeam = () => {
    setFormTeams((prevTeams) => [...prevTeams, ""]);
  };

  const handleRemoveTeam = (index, e) => {
    e.preventDefault();
    setFormTeams((prevTeams) => prevTeams.filter((_, i) => i !== index));
  };

  if (!team || team.length === 0) {
    return <div>No team data available</div>;
  }

  const addTeamStyle = {
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: isHovered ? "rgb(71, 148, 218)" : "white",
    color: isHovered ? "white" : "black",
    padding: "10px",
    textAlign: "center",
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Team</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {team.map((team) => (
            <tr key={team.name}>
              <td>{team.name}</td>
              <td>{team.description || 'No description'}</td>
            </tr>
          ))}
          <tr
            onClick={handleShow}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <td colSpan={2} style={addTeamStyle}>
              + Team to Project
            </td>
          </tr>
        </tbody>
      </Table>
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        fullscreen={false}
        style={{
          margin: "0",
          padding: "0",
          maxWidth: "100vw",
          width: "100vw",
        }}
        dialogClassName="mx-auto"
        contentClassName="mx-auto"
      >
        <Modal.Header
          closeButton
          className="justify-content-center border-0 p-4"
        >
          <Modal.Title className="text-center text-lg font-medium">
            Add Team to Project
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4 pt-0">
          <Form>
            <Form.Label className="mb-2 font-medium">Teams</Form.Label>
            <div className="space-y-2">
              {formTeams.map((teamName, index) => (
                <div key={index} className="d-flex align-items-center gap-2">
                  <Form.Control
                    id={`teams${index}`}
                    type="input"
                    placeholder="Enter team name"
                    value={formTeams[index]}
                    onChange={(e) => handleTeamChange(index, e.target.value)}
                    className="mb-2"
                    style={{
                      height: "38px",
                      flex: 1,
                    }}
                  />
                  <Button
                    variant="outline-danger"
                    onClick={(e) => handleRemoveTeam(index, e)}
                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "38px",
                      height: "38px",
                      padding: "0",
                      minWidth: "38px",
                    }}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline-primary"
              onClick={handleAddTeam}
              className="d-flex align-items-center gap-2 mt-3"
              style={{
                borderColor: "rgb(71, 148, 218)",
                color: "rgb(71, 148, 218)",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgb(71, 148, 218)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "rgb(71, 148, 218)";
              }}
            >
              <Plus className="w-4 h-4" />
              Add Team
            </Button>{" "}
          </Form>
        </Modal.Body>

        <Modal.Footer className="border-0 justify-content-center gap-2 p-4 pt-2">
          <Button variant="secondary" onClick={handleClose} className="px-4">
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleClose}
            className="px-4"
            style={{
              backgroundColor: "rgb(71, 148, 218)",
              borderColor: "rgb(71, 148, 218)",
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>{" "}
      <style>
        {`
          .modal-90w {
            max-width: 80% !important;
            width: 80% !important;
            margin: 0 auto;
          }
          .modal-content {
            height: 80vh;
            background-color: #f8f9fa;  /* Light gray background */
          }
          .modal-dialog {
            display: flex !important;
            align-items: center;
            height: 100vh;
          }
          .modal {
            padding-left: 0 !important;
          }
        `}
      </style>
    </>
  );
};

export default ProjectOverviewTeam;
