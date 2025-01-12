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
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {team.map((teamGroup) =>
            teamGroup.members.map((member) => (
              <tr key={`${teamGroup.name}-${member.email}`}>
                <td>{teamGroup.name}</td>
                <td>{`${member.first_name} ${member.last_name}`}</td>
                <td>{member.email}</td>
              </tr>
            )),
          )}
          <tr
            onClick={handleShow}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <td colSpan={3} style={addTeamStyle}>
              + Team to Project
            </td>
          </tr>
        </tbody>
      </Table>

      <Modal
        show={showModal}
        onHide={handleClose}
        size="xl"
        dialogClassName="modal-90w"
        style={{
          maxWidth: "80%",
          width: "80%",
          height: "80vh",
          margin: "0 auto",
        }}
      >
        <Modal.Header
          closeButton
          className="justify-content-center"
          style={{ borderBottom: "none" }}
        >
          <Modal.Title style={{ textAlign: "center" }}>
            Add Team to Project
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            height: "calc(80vh - 140px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          <Form className="w-75">
            <Form.Label className="d-block text-start w-100 custom-form-label">
              Teams
            </Form.Label>
            {formTeams.map((teamName, index) => (
              <div key={index} className="d-flex mb-2 align-items-center gap-2">
                <Form.Control
                  id={`teams${index}`}
                  type="input"
                  placeholder="Enter team name"
                  value={formTeams[index]}
                  onChange={(e) => handleTeamChange(index, e.target.value)}
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={(e) => handleRemoveTeam(index, e)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline-primary"
              onClick={handleAddTeam}
              className="mt-2"
              style={{
                borderColor: "rgb(71, 148, 218)",
                color: "rgb(71, 148, 218)",
              }}
            >
              <Plus className="w-4 h-4 me-2" />
              Add Team
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{
            borderTop: "none",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleClose}
            style={{
              backgroundColor: "rgb(71, 148, 218)",
              borderColor: "rgb(71, 148, 218)",
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
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
