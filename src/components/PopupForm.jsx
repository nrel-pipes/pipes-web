import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import createProject from "../pages/stores/DataStore";

const SensitivityForm = ({ sensitivity, index, handleChange, handleRemove }) => (
  <div className="mb-3">
    <h5>Sensitivity {index + 1}</h5>
    <Form.Control
      type="text"
      name={`sensitivities[${index}].name`}
      placeholder="Sensitivity Name"
      value={sensitivity.name}
      onChange={(e) => handleChange(e, index, 'sensitivities')}
      className="mb-2"
    />
    <Form.Control
      as="textarea"
      name={`sensitivities[${index}].description`}
      placeholder="Sensitivity Description"
      value={sensitivity.description.join('\n')}
      onChange={(e) => handleChange(e, index, 'sensitivities', true)}
      className="mb-2"
    />
    <Button variant="danger" onClick={() => handleRemove(index, 'sensitivities')}>
      Remove Sensitivity
    </Button>
  </div>
);

const ScenarioForm = ({ scenario, index, handleChange, handleRemove }) => (
  <div className="mb-3">
    <h5>Scenario {index + 1}</h5>
    <Form.Control
      type="text"
      name={`scenarios[${index}].name`}
      placeholder="Scenario Name"
      value={scenario.name}
      onChange={(e) => handleChange(e, index, 'scenarios')}
      className="mb-2"
    />
    <Form.Control
      as="textarea"
      name={`scenarios[${index}].description`}
      placeholder="Scenario Description"
      value={scenario.description.join('\n')}
      onChange={(e) => handleChange(e, index, 'scenarios', true)}
      className="mb-2"
    />
    <Button variant="danger" onClick={() => handleRemove(index, 'scenarios')}>
      Remove Scenario
    </Button>
  </div>
);

const MilestoneForm = ({ milestone, index, handleChange, handleRemove }) => (
  <div className="mb-3">
    <h5>Milestone {index + 1}</h5>
    <Row>
      <Col>
        <Form.Control
          type="text"
          name={`milestones[${index}].name`}
          placeholder="Milestone Name"
          value={milestone.name}
          onChange={(e) => handleChange(e, index, 'milestones')}
          className="mb-2"
        />
      </Col>
      <Col>
        <Form.Control
          type="datetime-local"
          name={`milestones[${index}].milestone_date`}
          value={milestone.milestone_date}
          onChange={(e) => handleChange(e, index, 'milestones')}
          className="mb-2"
        />
      </Col>
    </Row>
    <Form.Control
      as="textarea"
      name={`milestones[${index}].description`}
      placeholder="Milestone Description"
      value={milestone.description.join('\n')}
      onChange={(e) => handleChange(e, index, 'milestones', true)}
      className="mb-2"
    />
    <Button variant="danger" onClick={() => handleRemove(index, 'milestones')}>
      Remove Milestone
    </Button>
  </div>
);

const PopupForm = ({ showModal, handleClose, handleFormSubmit, formData, setFormData }) => {
  const handleChange = (e, index, field, isListField = false) => {
    const { name, value } = e.target;
    const updatedList = [...formData[field]];
    const fieldName = name.split('.')[1];

    updatedList[index] = {
      ...updatedList[index],
      [fieldName]: isListField ? value.split('\n') : value,
    };

    setFormData((prevData) => ({ ...prevData, [field]: updatedList }));
  };

  const handleAdd = (field, defaultValue) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], defaultValue],
    }));
  };

  const handleRemove = (index, field) => {
    const updatedList = [...formData[field]];
    updatedList.splice(index, 1);
    setFormData((prevData) => ({ ...prevData, [field]: updatedList }));
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault(); // Prevent form from refreshing the page
    }
    console.log('Submitting form data:', formData);
    handleFormSubmit(formData); // Pass formData to the parent component
  };
  return (
    <Modal show={showModal} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Project Name */}
          <Form.Group className="mb-3" controlId="formProjectName">
            <Form.Label>Project Name*</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Form.Group>

    {/* Project Title */}
    <Form.Group className="mb-3" controlId="formProjectTitle">
      <Form.Label>Project Title</Form.Label>
      <Form.Control
        type="text"
        name="title"
        placeholder="Enter project title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
    </Form.Group>

    {/* Project Description */}
    <Form.Group className="mb-3" controlId="formProjectDescription">
      <Form.Label>Project Description</Form.Label>
      <Form.Control
        as="textarea"
        rows={3}
        name="description"
        placeholder="Enter project description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
    </Form.Group>

    {/* Owner Information */}
    <h6>Owner Information</h6>
    <Form.Group className="mb-3" controlId="formOwnerEmail">
      <Form.Label>Owner Email</Form.Label>
      <Form.Control
        type="email"
        name="owner.email"
        placeholder="Enter owner's email"
        value={formData.owner.email}
        onChange={(e) => setFormData({
          ...formData,
          owner: { ...formData.owner, email: e.target.value }
        })}
      />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formOwnerFirstName">
      <Form.Label>Owner First Name</Form.Label>
      <Form.Control
        type="text"
        name="owner.first_name"
        placeholder="Enter owner's first name"
        value={formData.owner.first_name}
        onChange={(e) => setFormData({
          ...formData,
          owner: { ...formData.owner, first_name: e.target.value }
        })}
      />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formOwnerLastName">
      <Form.Label>Owner Last Name</Form.Label>
      <Form.Control
        type="text"
        name="owner.last_name"
        placeholder="Enter owner's last name"
        value={formData.owner.last_name}
        onChange={(e) => setFormData({
          ...formData,
          owner: { ...formData.owner, last_name: e.target.value }
        })}
      />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formOwnerOrganization">
      <Form.Label>Owner Organization</Form.Label>
      <Form.Control
        type="text"
        name="owner.organization"
        placeholder="Enter owner's organization"
        value={formData.owner.organization}
        onChange={(e) => setFormData({
          ...formData,
          owner: { ...formData.owner, organization: e.target.value }
        })}
      />
    </Form.Group>

    {/* Scheduled Start */}
    <Form.Group className="mb-3" controlId="formScheduledStart">
      <Form.Label>Scheduled Start</Form.Label>
      <Form.Control
        type="datetime-local"
        name="scheduled_start"
        value={formData.scheduled_start}
        onChange={(e) => setFormData({ ...formData, scheduled_start: e.target.value })}
      />
    </Form.Group>

    {/* Scheduled End */}
    <Form.Group className="mb-3" controlId="formScheduledEnd">
      <Form.Label>Scheduled End</Form.Label>
      <Form.Control
        type="datetime-local"
        name="scheduled_end"
        value={formData.scheduled_end}
        onChange={(e) => setFormData({ ...formData, scheduled_end: e.target.value })}
      />
    </Form.Group>

    {/* Scenarios */}
    <h4>Scenarios</h4>
    {formData.scenarios.map((scenario, index) => (
      <ScenarioForm
        key={index}
        scenario={scenario}
        index={index}
        handleChange={handleChange}
        handleRemove={handleRemove}
      />
    ))}
    <Button variant="secondary" className="mb-3" onClick={() => handleAdd('scenarios', { name: '', description: [''] })}>
      Add Scenario
    </Button>

    {/* Sensitivities */}
    <h4>Sensitivities</h4>
    {formData.sensitivities.map((sensitivity, index) => (
      <SensitivityForm
        key={index}
        sensitivity={sensitivity}
        index={index}
        handleChange={handleChange}
        handleRemove={handleRemove}
      />
    ))}
    <Button variant="secondary" className="mb-3" onClick={() => handleAdd('sensitivities', { name: '', description: [''] })}>
      Add Sensitivity
    </Button>

    {/* Milestones */}
    <h4>Milestones</h4>
          {formData.milestones.map((milestone, index) => (
            <MilestoneForm
              key={index}
              milestone={milestone}
              index={index}
              handleChange={handleChange}
              handleRemove={handleRemove}
            />
          ))}
          
          <Button variant="secondary" className="mb-3" onClick={() => handleAdd('milestones', { name: '', description: [''], milestone_date: '' })}>
            Add Milestone
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Create Project
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PopupForm;
